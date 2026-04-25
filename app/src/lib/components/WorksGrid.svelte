<script lang="ts">
	import type { WorksQueryResult } from '../../sanity.types';
	import Work from './Work.svelte';

	let { works }: { works: WorksQueryResult } = $props();

	const validWorks = $derived(works.filter((work) => work.image));
</script>

<div class="container mx-auto px-8 py-8">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
		{#each validWorks as work (work._id)}
			<Work {work} />
		{/each}
	</div>

	{#if validWorks.length === 0}
		<div class="flex items-center justify-center py-12">
			<p class="text-gray-500">No works available.</p>
		</div>
	{/if}
</div>
