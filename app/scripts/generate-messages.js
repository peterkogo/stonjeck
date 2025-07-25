import { createClient } from '@sanity/client';
import { defineQuery } from 'groq';
import { readFile, writeFile, mkdir } from 'fs/promises';

// Load environment variables from .env files
async function loadEnvVars() {
	try {
		const envContent = await readFile('.env', 'utf-8');
		const envVars = {};
		envContent.split('\n').forEach((line) => {
			const [key, value] = line.split('=');
			if (key && value) {
				envVars[key.trim()] = value.replace(/['"]/g, '').trim();
			}
		});
		return envVars;
	} catch {
		// Fallback to process.env if .env doesn't exist
		return process.env;
	}
}

// Create Sanity client
function createSanityClient(env) {
	const projectId = env.PUBLIC_SANITY_PROJECT_ID;
	const dataset = env.PUBLIC_SANITY_DATASET;
	const apiVersion = env.PUBLIC_SANITY_API_VERSION || '2025-06-15';
	const token = env.SANITY_API_READ_TOKEN;

	if (!projectId || !dataset) {
		throw new Error('Missing required Sanity environment variables');
	}

	return createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		token,
		stega: false
	});
}

// GROQ queries to fetch all data separately
const seriesQuery = defineQuery(`
  *[_type == "series"] | order(order desc) {
    _id,
    slug,
    title,
    order,
    works[]-> {
      _id,
      slug,
      title,
      image {
        ...,
        asset->{
          ...,
          metadata{
            blurHash,
            dimensions
          }
        }
      },
      date,
      size,
      medium-> {
        _id,
        name,
      }
    }
  }
`);

const mediumsQuery = defineQuery(`
  *[_type == "medium"] {
    _id,
    name
  }
`);

const informationQuery = defineQuery(`
  *[_type == "information"][0] {
    _id,
    _type,
    titleImage-> {
		image {
			...,
			asset->{
			...,
			metadata{
				blurHash,
				dimensions
			}
			}
		}
	},
    biography,
    impressum
  }
`);

// Generic recursive function to process any data structure
function processDataRecursively(data, messages) {
	// Handle arrays
	if (Array.isArray(data)) {
		return data.map((item) => processDataRecursively(item, messages));
	}

	// Handle null/undefined
	if (!data || typeof data !== 'object') {
		return data;
	}

	// Handle objects
	const processedData = { ...data };

	// Process each property
	for (const [key, value] of Object.entries(data)) {
		// Check if this is a localized field (array with _key and value)
		if (Array.isArray(value) && value.length > 0 && value[0]._key && value[0].value !== undefined) {
			// This is a localized field - process it
			const deValue = value.find((item) => item._key === 'de')?.value || '';
			const enValue = value.find((item) => item._key === 'en')?.value || deValue;

			// Use the object's _id as the message key
			if (data._id) {
				const messageKey = data._id;
				messages.de[messageKey] = deValue;
				messages.en[messageKey] = enValue;

				// Replace the localized field with generic warning message
				processedData[key] = '⚠️ USE_PARAGLIDE_MESSAGE ⚠️';
			}
		} else {
			// Recursively process nested data
			processedData[key] = processDataRecursively(value, messages);
		}
	}

	return processedData;
}

// Process all content and extract messages
function processAllContent(rawData) {
	const messages = { de: {}, en: {} };

	// Process all data recursively
	const processedData = processDataRecursively(rawData, messages);

	// Add UI labels
	messages.de.ui = messages.de.ui || {};
	messages.en.ui = messages.en.ui || {};
	messages.de.ui.biography = 'Biographie';
	messages.en.ui.biography = 'Biography';

	return { processedData, messages };
}

// Main function
async function generateMessages() {
	try {
		console.log('🚀 Starting message generation...');

		// Load environment variables
		const env = await loadEnvVars();

		// Create Sanity client
		const client = createSanityClient(env);

		// Fetch all data separately
		console.log('📡 Fetching data from Sanity...');
		const [series, mediums, information] = await Promise.all([
			client.fetch(seriesQuery),
			client.fetch(mediumsQuery),
			client.fetch(informationQuery)
		]);

		const rawData = { series, mediums, information };

		// Process data and extract messages recursively
		console.log('🔄 Processing localized content recursively...');
		const { processedData, messages } = processAllContent(rawData);

		// Ensure directories exist
		await mkdir('messages', { recursive: true });

		// Write data.ts instead of data.json
		console.log('📝 Writing data.ts...');
		const dataContent = `// Auto-generated data from Sanity CMS
// This file is generated by scripts/generate-messages.js

export const data = ${JSON.stringify(processedData, null, 2)} as const;
`;
		await writeFile('data.ts', dataContent);

		// Write message files
		console.log('📝 Writing message files...');
		await writeFile(
			'messages/de.json',
			JSON.stringify(
				{
					$schema: 'https://inlang.com/schema/inlang-message-format',
					...messages.de
				},
				null,
				2
			)
		);

		await writeFile(
			'messages/en.json',
			JSON.stringify(
				{
					$schema: 'https://inlang.com/schema/inlang-message-format',
					...messages.en
				},
				null,
				2
			)
		);

		// Count the messages (exclude UI)
		const totalMessages = Object.keys(messages.de).length - 1; // minus ui object

		console.log('✅ Successfully generated:');
		console.log('   - data.ts');
		console.log('   - messages/de.json');
		console.log('   - messages/en.json');
		console.log(`   - ${totalMessages} total messages (UUID-based)`);
		console.log(`   - ${processedData.series?.length || 0} series`);
		console.log(`   - ${processedData.mediums?.length || 0} mediums`);
		console.log(
			`   - ${processedData.series?.reduce((acc, s) => acc + (s.works?.length || 0), 0) || 0} works`
		);
		console.log('   - Processed recursively for any data structure');
	} catch (error) {
		console.error('❌ Error generating messages:', error);
		process.exit(1);
	}
}

// Run the script
generateMessages();
