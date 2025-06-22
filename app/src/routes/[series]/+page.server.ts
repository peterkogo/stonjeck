import type { PageServerLoad } from './$types';
import { getSeriesBySlug } from '$lib/sanity/server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const series = await getSeriesBySlug(params.series, locals.language);

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series
	};
};

export const prerender = true;
