import type { PageServerLoad } from './$types';
import { getInformation } from '$lib/sanity/server';

export const load: PageServerLoad = async ({ locals }) => {
	const information = await getInformation(locals.language);

	return {
		biography: information?.biography
	};
};

export const prerender = true;
