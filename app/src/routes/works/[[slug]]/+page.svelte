<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { page } from '$app/state';
	import { getWorks } from '$lib/data.remote';
	import WorksViewer from '$lib/works/WorksViewer.svelte';

	const works = await getWorks();
	const initialIndex = $derived.by(() => {
		if (!page.params.slug) return 0;
		const index = works.findIndex((work) => work.slug?.current === page.params.slug);
		if (index < 0) error(404, 'Work not found');
		return index;
	});
</script>

{#key page.params.slug}
	<WorksViewer {works} {initialIndex} />
{/key}
