import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { data } from '../../../data';

export const load: PageServerLoad = async ({ params }) => {
	const series = data.series?.find((s) => s.slug?.current === params.series);

	if (!series) {
		throw error(404, 'Series not found');
	}

	return {
		series
	};
};

export const prerender = true;
