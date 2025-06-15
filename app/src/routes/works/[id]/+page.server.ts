import type { PageServerLoad } from './$types';
import { getWorkById, getAllContentIds } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const work = await getWorkById(params.id);

	if (!work) {
		throw error(404, 'Work not found');
	}

	return {
		work
	};
};

// Enable prerendering for all work pages
export async function entries() {
	const { works } = await getAllContentIds();
	return works.map((id) => ({ id }));
}

export const prerender = true;
