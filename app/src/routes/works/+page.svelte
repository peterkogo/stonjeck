<script lang="ts">
	import { untrack } from 'svelte';
	import { afterNavigate, beforeNavigate, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';
	import { browser } from '$app/env';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { getWorks } from '$lib/data.remote';

	const works = await getWorks();

	let wrapper: HTMLDivElement | undefined = $state();

	function indexFromHash() {
		let hash = page.url.hash.slice(1);
		try {
			hash = decodeURIComponent(hash);
		} catch {
			return 0;
		}
		if (!hash) return 0;

		const index = works.findIndex((work) => work.slug?.current === hash);
		return index >= 0 ? index : 0;
	}

	// Scroll events can still contain the outgoing grid's position until
	// SvelteKit has restored the destination hash/history scroll position.
	let scrollReady = false;

	beforeNavigate(() => {
		scrollReady = false;
	});

	afterNavigate(() => {
		clearScrollTarget();
		scrollReady = true;
		updateCurrentIndex();
	});

	let currentIndex = $state(indexFromHash());
	let targetIndex: number | undefined;

	const currentWork = $derived(works[currentIndex]);
	const pageTitle = $derived(
		pick(currentWork?.title, 'en') || pick(currentWork?.title, 'de') || 'Works'
	);

	let previousSlug: string | undefined;

	function updateLastWork(slug: string | undefined) {
		console.log('updateLastWork', slug, previousSlug);
		if (!slug || !browser || slug === previousSlug) return;
		localStorage.setItem('last-work', slug);
		previousSlug = slug;
	}

	updateLastWork(untrack(() => currentWork?.slug?.current));

	function updateUrl(index: number) {
		const slug = works[index]?.slug?.current;
		if (!slug) return;

		// Remember the work even when its hash already matches (e.g. on entry).
		updateLastWork(slug);
		const nextHash = `#${encodeURIComponent(slug)}`;
		if (page.url.hash === nextHash) return;

		const href = `${page.url.pathname}${page.url.search}${nextHash}`;
		// @ts-expect-error href can include search+hash; generated RouteId omits this combination
		replaceState(resolve(href), page.state);
	}

	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		if (!scrollReady || !wrapper || works.length === 0) return;

		const clampedIndex = Math.max(0, Math.min(index, works.length - 1));
		const section = wrapper.querySelector<HTMLElement>(`[data-index="${clampedIndex}"]`);
		if (!section) return;

		targetIndex = clampedIndex;
		section.scrollIntoView({
			block: 'start',
			inline: 'nearest',
			behavior
		});
	}

	function clearScrollTarget() {
		targetIndex = undefined;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (
			!scrollReady ||
			event.defaultPrevented ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey
		)
			return;
		if (
			event.target instanceof HTMLElement &&
			event.target.closest('input, textarea, select, [contenteditable]')
		)
			return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				scrollToIndex((targetIndex ?? currentIndex) + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				scrollToIndex((targetIndex ?? currentIndex) - 1);
				break;
		}
	}

	function updateCurrentIndex() {
		if (!scrollReady || !wrapper) return;

		// Measure the rendered sections: dvh, viewport rounding and layout offsets
		// need not agree with window.innerHeight.
		const sections = wrapper.querySelectorAll<HTMLElement>('[data-index]');
		let closestIndex = -1;
		let closestDistance = Infinity;
		for (const section of sections) {
			const distance = Math.abs(section.getBoundingClientRect().top);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = Number(section.dataset.index);
			}
		}
		if (closestIndex < 0) return;

		currentIndex = closestIndex;
		updateUrl(currentIndex);
	}
</script>

<svelte:head>
	<title>Karim Stonjeck - {pageTitle}</title>
	<meta name="description" content="Artwork: {pageTitle}" />
</svelte:head>

<svelte:window
	onkeydown={handleKeydown}
	onscroll={updateCurrentIndex}
	onresize={updateCurrentIndex}
	onscrollend={clearScrollTarget}
	onwheel={clearScrollTarget}
	ontouchstart={clearScrollTarget}
	onpointerdown={clearScrollTarget}
/>

<div bind:this={wrapper}>
	{#each works as work, index (work._id)}
		{@const aspectRatio = work.image?.asset?.metadata?.dimensions?.aspectRatio ?? 1}
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
						<SanityImage
							image={work.image}
							alt={pick(work.title, 'en') || pick(work.title, 'de')}
							// viewTransitionName={currentWork === work ? `work-${work._id}` : undefined}
							imageWidth={1600}
							width="min(100cqw, calc(100cqh * {aspectRatio}))"
							height="min(100cqh, calc(100cqw / {aspectRatio}))"
							containerHeight="calc(100dvh - var(--spacing) * 32)"
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
