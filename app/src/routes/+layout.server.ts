import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { data } from '../../data';

export const load: LayoutServerLoad = async () => {
	const series = data.series;
	const works = data.works;

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series,
		works
	};
};

export const prerender = true;
