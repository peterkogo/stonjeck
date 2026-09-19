<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NewsEventsQueryResult, WorksQueryResult } from '../../sanity.types';
	import ExhibitionCard from './ExhibitionCard.svelte';
	import { matchesTagFilters, parseFilterQuery } from './filter-tags.svelte';
	import { navigating, page } from '$app/state';
	import { getTags } from '$lib/data.remote';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { pick } from '$lib/lang';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import { browser } from '$app/env';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { AfterNavigate, Navigation } from '@sveltejs/kit';

	const tags = await getTags();

	let {
		works,
		featured = false,
		events = []
	}: {
		works: WorksQueryResult;
		featured?: boolean;
		events?: NonNullable<NewsEventsQueryResult>;
	} = $props();

	const filteredWorks = $derived.by(() => {
		if (featured || !browser) return works;
		const selected = new Set(parseFilterQuery(page.url.searchParams.get('filter')));
		const filters = tags.flatMap((tag) => {
			const slug = tag.slug?.current;
			return slug && selected.has(slug) ? [slug] : [];
		});
		return works.filter((work) => matchesTagFilters(work.tags, filters));
	});

	function initialTransitionWorkId(): string | undefined {
		if (browser && !featured) {
			const lastWork = localStorage.getItem('last-work');
			if (!lastWork) return undefined;
			localStorage.removeItem('last-work');
			return works.find((work) => work.slug?.current === lastWork)?._id;
		}
		return undefined;
	}

	let transitionWorkId = $state<string | undefined>(initialTransitionWorkId());

	function restoreViewedWork({
		type,
		from,
		to
	}: Pick<Navigation | AfterNavigate, 'type' | 'from' | 'to'>) {
		if (to?.route.id !== '/') return;
		// Returning from the viewer follows the last viewed work, which may
		// differ from the work originally opened in this history entry.
		// Other back/forward navigation keeps SvelteKit's restored position.
		if (type === 'popstate' && from?.route.id !== '/works/[[slug]]') return;
		if (!transitionWorkId || ['#news', '#works'].includes(window.location.hash)) return;

		const slug = works.find((work) => work._id === transitionWorkId)?.slug?.current;
		if (!slug) return;

		const target = document.getElementById(slug);
		const section = document.getElementById('works');
		if (!target && !section) return;

		// Read layout before scrolling: center the artwork, bounded by the Works
		// section's responsive alignment and the document's scrollable range.
		const scrollY = window.scrollY;
		const viewportHeight = window.innerHeight;
		const targetBounds = target?.getBoundingClientRect();
		const sectionBounds = section?.getBoundingClientRect();
		const sectionMargin = section
			? parseFloat(getComputedStyle(section).scrollMarginTop) || 0
			: 0;
		const sectionTop = sectionBounds ? scrollY + sectionBounds.top - sectionMargin : 0;
		const centeredTop = targetBounds
			? scrollY + targetBounds.top + (targetBounds.height - viewportHeight) / 2
			: sectionTop;
		const maxScrollY = Math.max(0, document.documentElement.scrollHeight - viewportHeight);

		window.scrollTo({
			top: Math.min(maxScrollY, Math.max(0, sectionTop, centeredTop)),
			behavior: 'instant'
		});
	}

	onMount(() => {
		if (!navigating.to) return;
		// Restore as soon as the grid mounts, before its first paint. Kit's
		// afterNavigate runs later and can expose the viewer's scroll offset.
		restoreViewedWork(navigating);
	});

	// Reapply after Kit restores history, without disabling its scroll handling
	// for subsequent navigation into the viewer.
	afterNavigate(restoreViewedWork);
</script>

<div
	class="w-full overflow-x-hidden px-[18px] py-5 md:px-5 lg:p-8"
	class:min-h-screen={!featured}
>
	{#if !featured}
		<p
			role="status"
			class={filteredWorks.length === 0 ? 'text-muted-foreground py-8 text-sm' : 'sr-only'}
		>
			{filteredWorks.length === 0
				? getLocale() === 'de'
					? 'Keine Werke für diese Auswahl.'
					: 'No works match these filters.'
				: `${filteredWorks.length} ${getLocale() === 'de' ? 'Werke' : 'works'}`}
		</p>
	{/if}
	<div
		class="works-grid grid overflow-visible"
		class:featured
		style:--gap="15px"
		style:--precision={100}
		style:margin="calc(-1 * var(--gap, 0) / 2)"
	>
		{#each events as event (event._id)}
			{#if event.poster?.asset}
				{@const aspectRatio =
					event.poster.asset.metadata?.dimensions?.aspectRatio ?? 210 / 297}
				<div
					class="relative w-full"
					style:aspect-ratio={aspectRatio}
					style:grid-row="span calc(1 / {aspectRatio} * var(--precision))"
				>
					<div class="absolute" style:inset="calc(var(--gap, 0) / 2)">
						<ExhibitionCard {event} />
					</div>
				</div>
			{/if}
		{/each}
		{#each filteredWorks as work (work._id)}
			{@const dimensions = work.image?.asset?.metadata?.dimensions ?? {
				width: 0,
				height: 0,
				aspectRatio: 0
			}}
			{@const slug = work.slug?.current}
			<div
				style:--width={dimensions.width}
				style:--height={dimensions.height}
				style:aspect-ratio={dimensions.aspectRatio}
				style:width="100%"
				style:height="100%"
				style:position="relative"
				style:grid-row="span calc(var(--height) / var(--width) * var(--precision))"
			>
				<div style:position="absolute" style:inset="calc(var(--gap, 0) / 2)">
					{#if slug}
						<!-- The route is resolved before Paraglide localizes it. -->
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a
							id={featured ? `news-${slug}` : slug}
							class="block h-full w-full"
							onpointerdown={() => {
								transitionWorkId = work._id;
							}}
							href={localizeHref(resolve('/works/[[slug]]', { slug }))}
						>
							<SanityImage
								image={work.image}
								alt={pick(work.title, 'en') || pick(work.title, 'de') || 'Untitled'}
								imageWidth={1000}
								quality={55}
							/>
						</a>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.works-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: 48rem) {
		.works-grid {
			grid-template-columns: repeat(auto-fill, minmax(min(33.333333%, 360px), 1fr));
		}

		.featured {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
