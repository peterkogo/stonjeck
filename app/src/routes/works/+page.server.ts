import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getWorks } from '$lib/data.server';

export const load: PageServerLoad = async () => {
	const works = await getWorks();
	const firstSlug = works.find((work) => work.slug?.current)?.slug?.current;

	if (!firstSlug) {
		error(404, 'No works found');
	}

	redirect(308, `/works/${firstSlug}`);
};
