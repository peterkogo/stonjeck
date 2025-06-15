import type { PageServerLoad } from './$types';
import { getAllWorks } from '$lib/server/sanity';

export const load: PageServerLoad = async () => {
	const works = await getAllWorks();

	return {
		works
	};
};
