<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="max-w-4xl px-8 py-24">
	{#if data.biography}
		<div class="prose prose-lg leading-relaxed text-gray-700">
			{data.biography}
		</div>
	{:else}
		<p class="italic text-gray-500">Biography content not available.</p>
	{/if}
</div>
