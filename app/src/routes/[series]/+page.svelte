<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalizedValue, type SupportedLanguage } from '$lib/sanity/types';
	import SanityImage from '$lib/components/SanityImage.svelte';

	let { data }: { data: PageData } = $props();

	// You can integrate with paraglide-js for language switching
	const currentLanguage: SupportedLanguage = 'de'; // Default to English for now
</script>

<svelte:head>
	<title>{getLocalizedValue(data.series.title, currentLanguage) || 'Series'}</title>
	<meta name="description" content="Collection of artwork series" />
</svelte:head>

<div class="h-screen overflow-y-scroll scroll-smooth">
	{#if data.series.works}
		{#each data.series.works as work}
			{#if work && work.image}
				<div class="relative flex h-screen snap-start py-16">
					<div class="flex flex-1 items-center">
						<div class="relative flex max-h-full">
							<SanityImage
								image={work.image}
								alt={getLocalizedValue(work.title, currentLanguage) || 'Artwork'}
								class="max-h-full min-w-0 object-contain"
							/>
							<div
								class="sticky top-16 flex max-w-64 flex-shrink-0 items-start justify-end pl-8 pr-16"
								style:height="fit-content"
							>
								<div class="space-y-1 text-right">
									<h2 class="text-l font-semibold text-gray-800">
										{getLocalizedValue(work.title, currentLanguage)}
									</h2>
									<p class="text-[0.8rem] italic text-gray-500">
										{getLocalizedValue(work.medium.name, currentLanguage)}
									</p>
									<p class="text-[0.7rem] text-gray-400">
										{work.date.split('-')[0]}, {work.size} cm
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
