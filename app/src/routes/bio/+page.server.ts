import type { PageServerLoad } from './$types';
import { data } from '../../../data';

export const load: PageServerLoad = async () => {
	const information = data.information;

	return {
		information,
		biography: information?.biography
	};
};

export const prerender = true;
