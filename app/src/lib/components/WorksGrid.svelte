<script lang="ts">
	import Work from './Work.svelte';

	type WorkData = {
		_id: string;
		date?: string | null;
		size?: string;
		image?: any;
		medium?: {
			_id: string;
			name?: string;
		} | null;
		slug?: {
			current: string;
		} | null;
	};

	let { works }: { works: readonly WorkData[] } = $props();

	// Filter out works without images (data is already sorted chronologically from query)
	const validWorks = works.filter((work) => work.image);
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
