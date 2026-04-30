<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	// import { getSeries } from '$lib/data.remote';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';
	import { getWorks } from '$lib/data.remote';

	const works = await getWorks();

	// const filteredWorks = $derived.by(() => {
	// 	return works.filter((work) =>
	// 		work.tags.some((tag) => filterTagsState.selected.includes(tag.slug))
	// 	);
	// });

	let scrollContainer: HTMLDivElement | undefined = $state();
	let currentIndex = $state(0);

	function scrollToIndex(index: number) {
		if (!scrollContainer || !works) return;

		const clampedIndex = Math.max(0, Math.min(index, works.length - 1));

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

	$effect(() => {
		const slug = works[currentIndex]?.slug?.current;
		if (!slug) return;

		const nextHash = `#${slug}`;
		if (page.url.hash === nextHash) return;

		const href = `${page.url.pathname}${page.url.search}${nextHash}`;
		// @ts-expect-error href can include search+hash; generated RouteId omits this combination
		replaceState(resolve(href), page.state);
	});
</script>

<svelte:head>
	<title>Karim Stonjeck - Works</title>
	<meta name="description" content="Collection of artwork series" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div
	class="h-screen snap-y snap-mandatory overflow-y-scroll"
	bind:this={scrollContainer}
	onscroll={updateCurrentIndex}
>
	{#each works as work (work._id)}
		<div id={work.slug?.current} class="relative flex h-screen snap-start lg:p-16">
			<div class="flex min-h-0 min-w-0 flex-1 items-center justify-center">
				<div
					class="flex min-h-0 w-full max-w-full flex-col gap-0 p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-stretch lg:gap-x-8 lg:gap-y-0 lg:p-0"
				>
					<div
						class="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center self-stretch lg:h-full lg:w-full lg:max-w-full lg:flex-none"
					>
						<SanityImage
							image={work.image}
							alt={pick(work.title, 'en') || pick(work.title, 'de')}
							imageClass="max-h-[calc(100vh-var(--spacing)*32)] min-h-0 min-w-0 object-contain"
							viewTransitionName="work-{work._id}"
						/>
						<div class="text-l mt-2 w-full text-center align-middle lg:hidden">
							<span class="text-l font-semibold text-gray-800">
								<Lang text={work.title} /> •
							</span>
							<span class="text-[0.8rem] text-gray-500">
								<Lang text={work.medium.name} /> •
							</span>
							<span class="text-[0.8rem] text-nowrap text-gray-400">
								{work.date?.split('-')[0]} • {work.size} cm
							</span>
						</div>
					</div>
					<div
						class="sticky top-12 hidden w-full shrink-0 self-start lg:block"
						style:height="fit-content"
					>
						<div class="w-full space-y-1 text-right">
							<h2 class="text-l font-semibold text-gray-800">
								<Lang text={work.title} />
							</h2>
							<p class="text-[0.8rem] text-pretty text-gray-500 italic">
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
</div>
