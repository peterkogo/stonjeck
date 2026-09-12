<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import Lang from '$lib/components/Lang.svelte';
	import { pick } from '$lib/lang';
	import SanityImage from '$lib/components/SanityImage.svelte';
	import { getWorks } from '$lib/data.remote';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { whenViewTransitionFinished } from '$lib/view-transition';
	import { VList, type VListHandle } from 'virtua/svelte';
	import type { WorksQueryResult } from '../../../sanity.types';
	import { fade } from 'svelte/transition';

	type Work = WorksQueryResult[number];

	const works = await getWorks();

	function indexFromSlug(slug: string | undefined) {
		if (!slug) return -1;
		return works.findIndex((work) => work.slug?.current === slug);
	}

	const initialIndex = indexFromSlug(page.params.slug);
	if (initialIndex < 0) {
		error(404, 'Work not found');
	}

	let list: VListHandle | undefined = $state();
	let ready = $state(false);

	let currentIndex = $state(initialIndex);
	// eslint-disable-next-line svelte/prefer-writable-derived
	let targetIndex = $state(untrack(() => currentIndex));

	const currentWork = $derived(works[currentIndex]);
	const pageTitle = $derived(
		pick(currentWork?.title, 'en') || pick(currentWork?.title, 'de') || 'Works'
	);

	onMount(async () => {
		// Wait until the morph finishes before swapping the static hero for VList.
		// document.activeViewTransition is missing in Firefox — use our own tracker.
		await whenViewTransitionFinished();
		console.log('ready');
		ready = true;
	});

	$effect(() => {
		updateUrl(currentIndex);
	});

	$effect(() => {
		// We need to keep this in an effect not derived
		targetIndex = currentIndex;
	});

	$effect(() => {
		if (!list) return;

		const index = untrack(() => currentIndex);
		if (index > 0) {
			list.scrollToIndex(index, { align: 'start' });
		}
	});

	function updateLastWork(slug: string | undefined) {
		if (!slug || !browser) return;
		localStorage.setItem('last-work', slug);
	}

	updateLastWork(untrack(() => currentWork?.slug?.current));

	function updateUrl(index: number) {
		const slug = works[index]?.slug?.current;
		if (!slug) return;

		const href = localizeHref(`/works/${slug}`);
		if (page.url.pathname === href) return;

		// @ts-expect-error dynamic work slug path isn't in the generated RouteId union
		replaceState(resolve(href), page.state);
		updateLastWork(slug);
	}

	function scrollToIndex(index: number, smooth = true) {
		if (!list) return;

		const clampedIndex = Math.max(0, Math.min(index, works.length - 1));
		list.scrollToIndex(clampedIndex, { align: 'start', smooth });
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

	function handleScroll(offset: number) {
		if (!list) return;

		const viewport = list.getViewportSize();
		const newIndex = list.findItemIndex(offset + viewport / 2);
		if (newIndex !== currentIndex && newIndex >= 0) {
			currentIndex = newIndex;
		}
	}
</script>

<svelte:head>
	<title>Karim Stonjeck - {pageTitle}</title>
	<meta name="description" content="Artwork: {pageTitle}" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#snippet workSection(work: Work, index: number, withTransition = false)}
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
						viewTransitionName={withTransition ? `work-${work._id}` : undefined}
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
{/snippet}

<div class="relative h-dvh">
	{#if !ready}
		<div class="absolute size-full" out:fade>
			{@render workSection(works[initialIndex], initialIndex, true)}
		</div>
	{:else}
		<VList
			bind:this={list}
			data={works}
			getKey={(work) => work._id}
			style="height: 100dvh;"
			keepMounted={[currentIndex]}
			onscroll={handleScroll}
		>
			{#snippet children(work, index)}
				{@render workSection(work, index, index === currentIndex)}
			{/snippet}
		</VList>
	{/if}
</div>
