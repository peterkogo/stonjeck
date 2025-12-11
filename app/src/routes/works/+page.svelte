<script lang="ts">
	import type { PageData } from './$types';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	let scrollContainer: HTMLDivElement;
	let currentIndex = $state(data.initialIndex);

	function scrollToIndex(index: number) {
		if (!scrollContainer || !data.allWorks) return;

		const totalWorks = data.allWorks.length;
		const clampedIndex = Math.max(0, Math.min(index, totalWorks - 1));

		const scrollTop = clampedIndex * window.innerHeight;
		scrollContainer.scrollTo({
			top: scrollTop,
			behavior: 'instant' // No scroll animations as requested
		});

		currentIndex = clampedIndex;
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				scrollToIndex(currentIndex + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				scrollToIndex(currentIndex - 1);
				break;
		}
	}

	function updateCurrentIndex() {
		if (!scrollContainer) return;

		const scrollTop = scrollContainer.scrollTop;
		const newIndex = Math.round(scrollTop / window.innerHeight);
		currentIndex = newIndex;
	}

	// Set initial scroll position when component mounts
	onMount(() => {
		scrollToIndex(data.initialIndex);
	});
</script>

<svelte:head>
	<title>All Works - Karim Stonjeck</title>
	<meta name="description" content="Complete collection of artwork by Karim Stonjeck" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div
	bind:this={scrollContainer}
	onscroll={updateCurrentIndex}
	class="h-screen overflow-y-scroll"
	style="scroll-behavior: auto;"
>
	{#each data.allWorks as work, index (work._id)}
		{#if work && work.image}
			<div class="relative flex h-screen p-16">
				<div class="flex flex-1 items-center">
					<div class="flex flex-col p-8 lg:max-h-full lg:flex-row lg:p-0">
						<div style:view-transition-name="work-image-{work._id}">
							<SanityImage
								image={work.image}
								alt={m[work._id]()}
								class="max-h-[calc(100vh-var(--spacing)*16)] min-h-0 min-w-0 object-contain lg:max-h-full"
							/>
						</div>
						<div class="text-l mt-2 w-full text-center align-middle lg:hidden">
							<span class="text-l font-semibold text-gray-800">
								{m[work._id]()} •
							</span>
							<span class="text-[0.8rem] text-gray-500">
								{m[work.medium?._id]()} •
							</span>
							<span class="text-[0.8rem] text-gray-400">
								{work.date?.split('-')[0]} • {work.size} cm
							</span>
						</div>
						<div
							class="sticky top-16 hidden min-w-48 flex-shrink-0 items-start justify-end lg:flex"
							style:height="fit-content"
						>
							<div class="space-y-1 text-right">
								<h2 class="text-l font-semibold text-gray-800">
									{m[work._id]()}
								</h2>
								<p class="text-[0.8rem] italic text-gray-500">
									{m[work.medium?._id]()}
								</p>
								<p class="text-[0.7rem] text-gray-400">
									{work.date?.split('-')[0]} • {work.size} cm
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>
