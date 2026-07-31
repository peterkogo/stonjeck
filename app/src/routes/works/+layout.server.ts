import type { LayoutServerLoad } from './$types';

import { getWorks } from '$lib/data.server';

export const load: LayoutServerLoad = async () => {
	return {
		works: await getWorks()
	};
};
