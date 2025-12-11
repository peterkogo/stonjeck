import type { PageServerLoad } from './$types';
import { data } from '../../../data';

export const load: PageServerLoad = async ({ url }) => {
	// Get all works with images
	const allWorks = data.works.filter((work) => work.image);

	// Get the work ID from URL fragment or query param to scroll to
	const workId = url.searchParams.get('work');
	let initialIndex = 0;

	if (workId) {
		const index = allWorks.findIndex((work) => work._id === workId);
		if (index !== -1) {
			initialIndex = index;
		}
	}

	return {
		allWorks,
		initialIndex
	};
};

export const prerender = true;
