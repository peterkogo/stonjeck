import type { PageServerLoad } from './$types';

import { getInformation } from '$lib/data.server';

export const load: PageServerLoad = async () => {
	return {
		information: await getInformation()
	};
};
