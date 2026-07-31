import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

import { getWorks } from '$lib/data.server';

export const entries: EntryGenerator = async () => {
	const works = await getWorks();

	return works
		.map((work) => work.slug?.current)
		.filter((slug): slug is string => Boolean(slug))
		.map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const works = await getWorks();
	const currentIndex = works.findIndex((work) => work.slug?.current === params.slug);

	if (currentIndex === -1) {
		error(404, 'Work not found');
	}

	return {
		works,
		currentIndex,
		currentSlug: params.slug
	};
};
