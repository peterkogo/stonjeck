<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { type PageData } from './$types';

	let { data, children }: { data: PageData; children: Snippet } = $props();

	// Helper function to get title in preferred language (defaulting to English)
	function getTitle(titleArray: any[]) {
		const englishTitle = titleArray.find((t) => t._key === 'de');
		return englishTitle?.value || titleArray[0]?.value || 'Untitled';
	}
</script>

<div class="flex min-h-screen">
	<!-- Transparent Sidebar -->
	<aside class="w-64 p-8">
		<a href="/" class="mb-8 block">
			<h1 class="mb-8 text-2xl font-bold text-gray-900">Karim Stonjeck</h1>
		</a>

		<!-- Series List -->
		{#if data.series && data.series.length > 0}
			<div class="space-y-3">
				{#each data.series as series}
					<a
						href={`/${series.slug.current}`}
						class="block cursor-pointer text-gray-700 hover:text-gray-900"
					>
						{getTitle(series.title)}
					</a>
				{/each}
			</div>
		{/if}
	</aside>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
