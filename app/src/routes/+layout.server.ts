import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllSeries } from '$lib/sanity/server';

export const load: PageServerLoad = async () => {
	const series = await getAllSeries();

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series
	};
};

export const prerender = true;
