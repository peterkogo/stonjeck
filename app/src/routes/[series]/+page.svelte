<script lang="ts">
	import type { PageData } from './$types';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { m } from '$lib/paraglide/messages';

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
	<title>{m[data.series._id]()}</title>
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
				<div class="relative flex h-screen snap-start p-16">
					<div class="flex flex-1 items-center">
						<div class="flex flex-col p-8 lg:max-h-full lg:flex-row lg:p-0">
							<SanityImage
								image={work.image}
								alt={m[work._id]()}
								class="max-h-[calc(100vh-var(--spacing)*16)] min-h-0 min-w-0 object-contain lg:max-h-full"
							/>
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
	{/if}
</div>
