import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION
} from '$env/static/public';

function assertEnvVar<T>(value: T | undefined, name: string): T {
	if (value === undefined) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

const projectId = assertEnvVar(PUBLIC_SANITY_PROJECT_ID, 'PUBLIC_SANITY_PROJECT_ID');
const dataset = assertEnvVar(PUBLIC_SANITY_DATASET, 'PUBLIC_SANITY_DATASET');
const apiVersion = PUBLIC_SANITY_API_VERSION.trim() || '2025-06-15';

if (
	apiVersion !== '1' &&
	(!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion) || !(Date.parse(apiVersion) > 0))
) {
	// This setting is public. Escape invisible characters to make build errors actionable.
	const received = JSON.stringify(PUBLIC_SANITY_API_VERSION).replace(
		/[^\x20-\x7e]/g,
		(char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
	);
	throw new Error(
		`Invalid PUBLIC_SANITY_API_VERSION: received ${received}. Set the build variable to a date such as 2025-06-15, without quotes or the variable name.`
	);
}

// Fetch fresh content when prerendering the site.
export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
