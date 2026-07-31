<script lang="ts">
	import { untrack } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';
	import SanityImagesScroll from '$lib/components/SanityImagesScroll.svelte';

	let { data } = $props();
	let works = $derived(data.works);

	let wrapper: HTMLDivElement | undefined = $state();

	function indexFromHash() {
		const hash = page.url.hash.slice(1);
		if (!hash) return 0;

		const index = data.works.findIndex((work) => work.slug?.current === hash);
		return index >= 0 ? index : 0;
	}

	let scrolling = $state(false);
	let currentIndex = $state(indexFromHash());
	let targetIndex = $state(untrack(() => currentIndex));

	const currentWork = $derived(works[currentIndex]);
	const pageTitle = $derived(
		pick(currentWork?.title, 'en') || pick(currentWork?.title, 'de') || 'Works'
	);

	$effect(() => {
		updateUrl(currentIndex);
	});

	$effect(() => {
		// We need to keep this in an effect not derived
		if (!scrolling) targetIndex = currentIndex;
	});

	function updateUrl(index: number) {
		const slug = works[index]?.slug?.current;
		if (!slug) return;

		const nextHash = `#${slug}`;
		if (page.url.hash === nextHash) return;

		const href = `${page.url.pathname}${page.url.search}${nextHash}`;
		// @ts-expect-error href can include search+hash; generated RouteId omits this combination
		replaceState(resolve(href), page.state);
	}

	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		if (!wrapper) return;

		const clampedIndex = Math.max(0, Math.min(index, works.length - 1));
		const section = wrapper.querySelector<HTMLElement>(`[data-index="${clampedIndex}"]`);
		if (!section) return;

		section.scrollIntoView({
			block: 'start',
			inline: 'nearest',
			behavior
		});

		scrolling = true;
		targetIndex = clampedIndex;
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				scrollToIndex(targetIndex + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				scrollToIndex(targetIndex - 1);
				break;
		}
	}

	function updateCurrentIndex() {
		const scrollTop = window.scrollY;
		const newIndex = Math.round(scrollTop / window.innerHeight);
		if (newIndex !== currentIndex) {
			currentIndex = newIndex;
		}
	}
</script>

<svelte:head>
	<title>Karim Stonjeck - {pageTitle}</title>
	<meta name="description" content="Artwork: {pageTitle}" />
</svelte:head>

<svelte:window
	onkeydown={handleKeydown}
	onscroll={updateCurrentIndex}
	onscrollend={() => {
		scrolling = false;
	}}
/>

<div bind:this={wrapper}>
	{#each works as work, index (work._id)}
		<section
			id={work.slug?.current}
			class="relative flex h-dvh snap-start snap-always lg:p-16"
			data-index={index}
			aria-label={pick(work.title, 'en') || pick(work.title, 'de') || undefined}
		>
			<div class="flex min-h-0 min-w-0 flex-1 items-center justify-center">
				<div
					class="flex min-h-0 w-full max-w-full flex-col gap-0 p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-stretch lg:gap-x-8 lg:gap-y-0 lg:p-0"
				>
					<div
						class="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center self-stretch lg:h-full lg:w-full lg:max-w-full lg:flex-none"
					>
						<SanityImagesScroll
							image={work.image}
							alt={pick(work.title, 'en') || pick(work.title, 'de')}
							viewTransitionName="work-{work._id}"
							width={1600}
						/>
						<div class="text-l mt-2 w-full text-center align-middle lg:hidden">
							<span class="text-l font-semibold text-gray-800">
								<Lang text={work.title} /> •
							</span>
							<span class="text-[0.8rem] text-gray-500">
								<Lang text={work.medium?.name} /> •
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
							{#if work.medium}
								<p class="text-[0.8rem] text-pretty text-gray-500 italic">
									<Lang text={work.medium.name} />
								</p>
							{/if}
							<p class="text-[0.7rem] text-gray-400">
								{work.date?.split('-')[0]} • {work.size} cm
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/each}
</div>
