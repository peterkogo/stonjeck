<script lang="ts">
	import { flushSync, onMount, untrack } from 'svelte';
	import { afterNavigate, beforeNavigate, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { navigating, page } from '$app/state';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';
	import { browser } from '$app/env';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { WorksQueryResult } from '../../sanity.types';

	let { works, initialIndex }: { works: WorksQueryResult; initialIndex: number } = $props();
	let wrapper: HTMLDivElement | undefined = $state();
	let expanded = $state(false);
	const visibleWorks = $derived(
		expanded
			? works.map((work, index) => ({ work, index }))
			: works
					.slice(initialIndex, initialIndex + 1)
					.map((work) => ({ work, index: initialIndex }))
	);

	// Scroll events can still contain the outgoing grid's position until
	// SvelteKit has restored the destination hash/history scroll position.
	let scrollReady = false;

	beforeNavigate(() => {
		scrollReady = false;
	});

	function activateGallery(restoreSlug?: string) {
		clearScrollTarget();
		if (!expanded && wrapper) {
			const anchor = wrapper.querySelector<HTMLElement>('[data-index]');
			const top = anchor?.getBoundingClientRect().top ?? 0;
			const root = document.documentElement;
			const snap = root.style.scrollSnapType;
			const anchoring = root.style.overflowAnchor;
			root.style.scrollSnapType = 'none';
			root.style.overflowAnchor = 'none';
			// Insert and compensate synchronously, before the browser can paint.
			// The keyed section (including its already loaded image) stays mounted.
			flushSync(() => {
				expanded = true;
			});
			if (anchor) {
				window.scrollBy({
					top: anchor.getBoundingClientRect().top - top,
					behavior: 'instant'
				});
			}
			root.style.scrollSnapType = snap;
			root.style.overflowAnchor = anchoring;
		}
		scrollReady = true;
		if (restoreSlug) {
			const index = works.findIndex((work) => work.slug?.current === restoreSlug);
			if (index >= 0) scrollToIndex(index, 'instant');
		}
		updateCurrentIndex();
	}

	afterNavigate(({ type }) => {
		// Shallow replacements retain the original params in history, so a
		// popstate destination can name a different work from initialIndex.
		const slug =
			type === 'popstate'
				? decodeURIComponent(
						window.location.pathname.replace(/\/$/, '').split('/').pop() ?? ''
					)
				: undefined;
		activateGallery(slug);
	});
	onMount(() => {
		// Initial hydration recovery can miss afterNavigate. During client
		// navigation, however, only afterNavigate may expand the list: Kit
		// still has to reset/restore scroll after this component mounts.
		if (navigating.to) return;
		const frame = requestAnimationFrame(() => {
			if (!navigating.to) activateGallery();
		});
		return () => cancelAnimationFrame(frame);
	});

	let currentIndex = $state(untrack(() => initialIndex));
	let targetIndex: number | undefined;

	const currentWork = $derived(works[currentIndex]);
	const pageTitle = $derived(
		pick(currentWork?.title, 'en') || pick(currentWork?.title, 'de') || 'Works'
	);

	let previousSlug: string | undefined;

	function updateLastWork(slug: string | undefined) {
		if (!slug || !browser || slug === previousSlug) return;
		localStorage.setItem('last-work', slug);
		previousSlug = slug;
	}

	updateLastWork(untrack(() => currentWork?.slug?.current));

	function updateUrl(index: number) {
		const slug = works[index]?.slug?.current;
		if (!slug) return;

		updateLastWork(slug);
		const href = localizeHref(resolve('/works/[[slug]]', { slug }));
		// This temporary URL does not participate in reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const url = new URL(href, page.url);
		url.search = page.url.search;
		if (page.url.pathname === url.pathname && !page.url.hash) return;
		// The pathname was resolved before localization above.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		replaceState(url, page.state);
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
	{#each visibleWorks as { work, index } (work._id)}
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
