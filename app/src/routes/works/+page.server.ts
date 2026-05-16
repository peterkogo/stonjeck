import type { PageServerLoad } from './$types';

import { getWorks } from '$lib/data.server';

export const load: PageServerLoad = async () => {
	return {
		works: await getWorks()
	};
};
