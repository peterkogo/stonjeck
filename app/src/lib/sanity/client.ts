import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION
} from '$env/static/public';

export function assertEnvVar<T>(value: T | undefined, name: string): T {
	if (value === undefined) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

export const projectId = assertEnvVar(PUBLIC_SANITY_PROJECT_ID, 'PUBLIC_SANITY_PROJECT_ID');
export const dataset = assertEnvVar(PUBLIC_SANITY_DATASET, 'PUBLIC_SANITY_DATASET');
export const apiVersion = PUBLIC_SANITY_API_VERSION || '2025-06-15';

// client serving uncached content everything is static anyway
// we want the build to always have the newest content
export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false
});

// Only use cached client for images (not sure if this is necessary)
const cachedClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false
});
const builder = createImageUrlBuilder(cachedClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
