<script lang="ts">
	import type { WorksQueryResult } from '../../sanity.types';
	import { pick } from '$lib/lang';
	import SanityImage from './SanityImage.svelte';

	let { work }: { work: WorksQueryResult[number] } = $props();
</script>

{#if work.image}
	<SanityImage
		image={work.image}
		alt={pick(work.title, 'en') || pick(work.title, 'de') || 'Untitled'}
		class="aspect-square w-full object-cover"
		width={400}
		height={400}
		fit="crop"
	/>
{/if}
