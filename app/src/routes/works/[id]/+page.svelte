<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalizedValue, type SupportedLanguage } from '$lib/sanity/types';
	import SanityImage from '$lib/components/SanityImage.svelte';

	let { data }: { data: PageData } = $props();

	// You can integrate with paraglide-js for language switching
	const currentLanguage: SupportedLanguage = 'en'; // Default to English for now

	const work = data.work;
	const title = getLocalizedValue(work.title, currentLanguage);
	const description = getLocalizedValue(work.description, currentLanguage);
	const mediumTitle = getLocalizedValue(work.medium.name, currentLanguage);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description || `${title} - ${work.year}`} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<nav class="mb-8">
		<a href="/works" class="font-medium text-blue-600 hover:text-blue-800"> ← Back to Works </a>
	</nav>

	<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
		<!-- Image -->
		<div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
			<SanityImage
				image={work.image}
				alt={title}
				class="h-full w-full object-cover"
				loading="eager"
				width={800}
				height={800}
				quality={90}
			/>
		</div>

		<!-- Details -->
		<div class="flex flex-col justify-center">
			<h1 class="mb-6 text-4xl font-bold text-gray-900">
				{title}
			</h1>

			<div class="space-y-4 text-lg">
				<div>
					<span class="font-semibold text-gray-700">Year:</span>
					<span class="ml-2 text-gray-900">{work.year}</span>
				</div>

				<div>
					<span class="font-semibold text-gray-700">Size:</span>
					<span class="ml-2 text-gray-900">{work.size}</span>
				</div>

				<div>
					<span class="font-semibold text-gray-700">Medium:</span>
					<span class="ml-2 text-gray-900">{mediumTitle}</span>
				</div>

				{#if description}
					<div class="pt-4">
						<h2 class="mb-2 font-semibold text-gray-700">Description:</h2>
						<p class="whitespace-pre-line leading-relaxed text-gray-900">
							{description}
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Additional metadata -->
	<div class="mt-12 border-t border-gray-200 pt-8">
		<div class="space-y-1 text-sm text-gray-500">
			<p>Work ID: {work._id}</p>
			<p>Created: {new Date(work._createdAt).toLocaleDateString()}</p>
			<p>Last updated: {new Date(work._updatedAt).toLocaleDateString()}</p>
		</div>
	</div>
</div>
