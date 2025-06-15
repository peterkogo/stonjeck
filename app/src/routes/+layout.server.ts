import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAllSeries } from '$lib/sanity/server';

export const load: LayoutServerLoad = async ({ url }) => {
	const series = await getAllSeries();

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series,
		currentPath: url.pathname
	};
};

export const prerender = true;
