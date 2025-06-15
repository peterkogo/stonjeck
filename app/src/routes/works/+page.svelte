<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalizedValue, type SupportedLanguage } from '$lib/sanity/types';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	// You can integrate with paraglide-js for language switching
	const currentLanguage: SupportedLanguage = 'en'; // Default to English for now
</script>

<svelte:head>
	<title>Works</title>
	<meta name="description" content="Gallery of artworks" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Works</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.works as work (work._id)}
			<article class="group cursor-pointer">
				<a href="/works/{work._id}" class="block">
					<div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
						<SanityImage
							image={work.image}
							alt={getLocalizedValue(work.title, currentLanguage)}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					</div>

					<div class="mt-4">
						<h2 class="text-xl font-semibold text-gray-900">
							{getLocalizedValue(work.title, currentLanguage)}
						</h2>
						<p class="mt-1 text-gray-600">
							{work.year} • {work.size}
						</p>
						<p class="text-gray-600">
							{getLocalizedValue(work.medium.name, currentLanguage)}
						</p>
						{#if work.description}
							<p class="mt-2 line-clamp-3 text-gray-700">
								{getLocalizedValue(work.description, currentLanguage)}
							</p>
						{/if}
					</div>
				</a>
			</article>
		{/each}
	</div>

	{#if data.works.length === 0}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-500">No works found.</p>
		</div>
	{/if}
</div>
