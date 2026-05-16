<script lang="ts">
	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';

	let { data } = $props();
	let series = $derived(data.series);

	let scrollContainer: HTMLDivElement | undefined = $state();
	let currentIndex = $state(0);

	function captureScrollContainer(node: HTMLDivElement) {
		scrollContainer = node;
		return {
			destroy() {
				if (scrollContainer === node) scrollContainer = undefined;
			}
		};
	}

	function scrollToIndex(index: number) {
		if (!scrollContainer || !series.works) return;

		const totalWorks = series.works.filter((work: { image?: unknown }) => work?.image).length;
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
	<title>{pick(series.title, 'de')}</title>
	<meta name="description" content="Collection of artwork series" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div
	use:captureScrollContainer
	onscroll={updateCurrentIndex}
	class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
>
	{#if series.works}
		{#each series.works as work (work._id)}
			<div class="relative flex h-screen snap-start p-16">
				<div class="flex flex-1 items-center">
					<div class="flex flex-col p-8 lg:max-h-full lg:flex-row lg:p-0">
						<SanityImage
							image={work.image}
							alt={pick(work.title, 'en') || pick(work.title, 'de')}
							class="max-h-[calc(100vh-var(--spacing)*16)] min-h-0 min-w-0 object-contain lg:max-h-full"
							viewTransitionName="work-{work._id}"
						/>
						<div class="text-l mt-2 w-full text-center align-middle lg:hidden">
							<span class="text-l font-semibold text-gray-800">
								<Lang text={work.title} /> •
							</span>
							<span class="text-[0.8rem] text-gray-500">
								<Lang text={work.medium.name} /> •
							</span>
							<span class="text-[0.8rem] text-gray-400">
								{work.date?.split('-')[0]} • {work.size} cm
							</span>
						</div>
						<div
							class="sticky top-16 hidden min-w-48 shrink-0 items-start justify-end lg:flex"
							style:height="fit-content"
						>
							<div class="space-y-1 text-right">
								<h2 class="text-l font-semibold text-gray-800">
									<Lang text={work.title} />
								</h2>
								<p class="text-[0.8rem] text-gray-500 italic">
									<Lang text={work.medium.name} />
								</p>
								<p class="text-[0.7rem] text-gray-400">
									{work.date?.split('-')[0]} • {work.size} cm
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
