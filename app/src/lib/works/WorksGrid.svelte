<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { WorksQueryResult } from '../../sanity.types';
	import { filterTagsState } from './filter-tags.svelte';
	import { cubicInOut, cubicIn } from 'svelte/easing';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { pick } from '$lib/lang';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import { browser } from '$app/env';
	import { afterNavigate } from '$app/navigation';

	let { works }: { works: WorksQueryResult } = $props();

	type WorkWithSeries = WorksQueryResult[number] & {
		series?: Array<{ slug: { current: string } | null } | null> | null;
	};

	const filteredWorks = $derived.by(() => {
		if (filterTagsState.selected.length === 0) return works;

		const selectedFilters = new Set(filterTagsState.selected);

		return (works as WorkWithSeries[]).filter((work) => {
			if (!work.series || work.series.length === 0) return false;

			return work.series.some((series) => {
				const slug = series?.slug?.current;
				return slug ? selectedFilters.has(slug) : false;
			});
		});
	});

	function initialTransitionWorkId(): string | undefined {
		if (browser) {
			const lastWork = localStorage.getItem('last-work');
			if (!lastWork) return undefined;
			localStorage.removeItem('last-work');
			return works.find((work) => work.slug?.current === lastWork)?._id;
		}
		return undefined;
	}

	let transitionWorkId = $state<string | undefined>(initialTransitionWorkId());

	afterNavigate(() => {
		if (!transitionWorkId) return;

		const slug = works.find((work) => work._id === transitionWorkId)?.slug?.current;
		if (!slug) return;

		document.getElementById(slug)?.scrollIntoView({
			block: 'center',
			behavior: 'instant'
		});
	});
</script>

<!-- <svelte:window onpointerup={cleanTransitionWorkId} onpointercancel={cleanTransitionWorkId} /> -->

<div class="w-full overflow-x-hidden p-5 lg:p-8">
	<!-- <div
		class="pointer-events-none fixed top-0 z-10 grid w-[calc(100%-var(--spacing)*7)] overflow-visible [--frame-width:160px] md:[--frame-width:360px] lg:w-[calc(100%-var(--spacing)*12)]"
		style:--gap="15px"
		style:--precision={100}
		style:margin="calc(-1 * var(--gap, 0) / 2)"
		style:grid-template-columns="repeat(auto-fill, minmax(var(--frame-width), 1fr))"
	>
		<div
			class="bg-background pt-5 lg:pt-8"
			style:--width={menuSize.width}
			style:--height={menuSize.height}
			style:aspect-ratio={menuSize.width / menuSize.height}
			style:width="100%"
			style:height="100%"
			style:position="relative"
			style:grid-row="span calc(var(--height) / var(--width) * var(--precision))"
		>
			<div style:padding="calc(var(--gap, 0) / 2)" class="pointer-events-auto">
				<a href={resolve((localizeHref('/about') as '/about') || '/en/about')}>
					<KarimStonjeck class="text-brown" />
				</a>
			</div>
		</div>
	</div> -->
	<div
		class="grid overflow-visible [--frame-width:160px] md:[--frame-width:360px]"
		style:--gap="15px"
		style:--precision={100}
		style:margin="calc(-1 * var(--gap, 0) / 2)"
		style:grid-template-columns="repeat(auto-fill, minmax(var(--frame-width), 1fr))"
	>
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
				animate:flip={{ duration: 500, easing: cubicInOut }}
			>
				<div
					style:position="absolute"
					style:inset="calc(var(--gap, 0) / 2)"
					in:fade={{ delay: 100, duration: 250, easing: cubicIn }}
					out:fade={{ duration: 2000, easing: cubicIn }}
				>
					{#if slug}
						<a
							id={slug}
							onpointerdown={() => {
								transitionWorkId = work._id;
							}}
							href={`${localizeHref('/works')}#${slug}`}
						>
							<SanityImage
								image={work.image}
								alt={pick(work.title, 'en') || pick(work.title, 'de') || 'Untitled'}
								imageWidth={1000}
								quality={55}
								viewTransitionName={transitionWorkId === work._id
									? `work-${work._id}`
									: undefined}
							/>
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
