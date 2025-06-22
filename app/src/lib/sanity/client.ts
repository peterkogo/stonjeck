import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
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

// Public client for browser-side image handling
export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	stega: false
});

export function urlFor(source: SanityImageSource) {
	const builder = imageUrlBuilder(sanityClient);

	return builder.image(source);
}

// Server-side client with read token (will be configured in server code)
export function createServerClient(token?: string) {
	return createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		token,
		stega: false
	});
}
