<script lang="ts">
	import { SpannedMasonryGrid, SpannedFrame } from '@masonry-grid/svelte';
	import type { WorksQueryResult } from '../../sanity.types';
	import Work from './Work.svelte';

	let { works }: { works: WorksQueryResult } = $props();
</script>

<div class="container mx-auto px-8 py-8">
	<SpannedMasonryGrid frameWidth={260} gap={15} precision={100} class="w-full">
		{#each works as work (work._id)}
			<SpannedFrame
				width={work.image.asset.metadata.dimensions.width}
				height={work.image.asset.metadata.dimensions.height}
			>
				<Work {work} />
			</SpannedFrame>
		{/each}
	</SpannedMasonryGrid>
</div>
