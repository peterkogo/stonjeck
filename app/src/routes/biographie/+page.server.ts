import type { PageServerLoad } from './$types';
import { getInformation } from '$lib/sanity/server';

export const load: PageServerLoad = async () => {
	const information = await getInformation();

	return {
		biography: information.biography
	};
};

export const prerender = true;
