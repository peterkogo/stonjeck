<script lang="ts">
	import type { PageData } from './$types';
	import SanityImage from '$lib/components/SanityImage.svelte';

	let { data }: { data: PageData } = $props();

	let scrollContainer: HTMLDivElement;
	let currentIndex = $state(0);

	function scrollToIndex(index: number) {
		if (!scrollContainer || !data.series.works) return;

		const totalWorks = data.series.works.filter((work) => work && work.image).length;
		const clampedIndex = Math.max(0, Math.min(index, totalWorks - 1));

		const scrollTop = clampedIndex * window.innerHeight;
		scrollContainer.scrollTo({
			top: scrollTop,
			behavior: 'smooth'
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
</script>

<svelte:head>
	<title>{data.series.title}</title>
	<meta name="description" content="Collection of artwork series" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div
	bind:this={scrollContainer}
	onscroll={updateCurrentIndex}
	class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
>
	{#if data.series.works}
		{#each data.series.works as work (work.slug?.current)}
			{#if work && work.image}
				<div class="relative flex h-screen snap-start py-16">
					<div class="flex flex-1 items-center">
						<div class="relative flex max-h-full">
							<SanityImage
								image={work.image}
								alt={work.title}
								class="max-h-full min-w-0 object-contain"
							/>
							<div
								class="sticky top-16 flex min-w-64 flex-shrink-0 items-start justify-end pl-8 pr-16"
								style:height="fit-content"
							>
								<div class="space-y-1 text-right">
									<h2 class="text-l font-semibold text-gray-800">
										{work.title}
									</h2>
									<p class="text-[0.8rem] italic text-gray-500">
										{work.medium?.name}
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
	{/if}
</div>
