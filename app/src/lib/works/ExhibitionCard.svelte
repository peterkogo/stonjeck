<script lang="ts">
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { pick } from '$lib/lang';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { NewsEventsQueryResult } from '../../sanity.types';

	let { event }: { event: NonNullable<NewsEventsQueryResult>[number] } = $props();
</script>

{#if event.poster?.asset}
	<SanityImage
		image={event.poster}
		alt={pick(event.poster.alt, getLocale()) || event.title || ''}
		imageWidth={1000}
		quality={70}
	/>
{/if}
