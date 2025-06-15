<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalizedValue } from '$lib/sanity/types';

	let { data }: { data: PageData } = $props();

	// Get the biography text in German (default for this site based on the nav)
	const biographyText = getLocalizedValue(data.biography, 'de', 'en');
</script>

<div class="max-w-4xl px-8 py-24">
	{#if biographyText}
		<div class="prose prose-lg leading-relaxed text-gray-700">
			{@html biographyText.replace(/\n/g, '<br>')}
		</div>
	{:else}
		<p class="italic text-gray-500">Biography content not available.</p>
	{/if}
</div>
