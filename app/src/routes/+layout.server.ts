import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { data } from '../../data';

export const load: LayoutServerLoad = async ({ url }) => {
	const series = data.series;

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series,
		currentPath: url.pathname
	};
};

export const prerender = true;
