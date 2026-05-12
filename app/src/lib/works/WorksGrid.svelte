<script lang="ts">
	import { resolve } from '$app/paths';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { WorksQueryResult } from '../../sanity.types';
	import { filterTagsState } from './filter-tags.svelte';
	import { cubicInOut, cubicIn } from 'svelte/easing';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { pick } from '$lib/lang';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import KarimStonjeck from '$lib/components/KarimStonjeck.svelte';

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

	let transitionWorkId = $state<string | undefined>();
</script>

<!-- <svelte:window onpointerup={cleanTransitionWorkId} onpointercancel={cleanTransitionWorkId} /> -->

<div class="w-full overflow-x-hidden p-5 lg:p-8">
	<div
		class="grid overflow-visible [--frame-width:160px] md:[--frame-width:360px]"
		style:--gap="15px"
		style:--precision={100}
		style:margin="calc(-1 * var(--gap, 0) / 2)"
		style:grid-template-columns="repeat(auto-fill, minmax(var(--frame-width), 1fr))"
	>
		<div
			style:--width={100}
			style:--height={20}
			style:aspect-ratio={100 / 20}
			style:width="100%"
			style:height="100%"
			style:position="relative"
			style:grid-row="span calc(var(--height) / var(--width) * var(--precision))"
		>
			<div style:padding="calc(var(--gap, 0) / 2)">
				<a href={resolve((localizeHref('/bio') as '/bio') || '/en/bio')}>
					<KarimStonjeck class="text-brown" underline />
				</a>
			</div>
		</div>
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
							onpointerdown={() => {
								transitionWorkId = work._id;
							}}
							href={resolve(localizeHref(`/works#${slug}`) as `/works#${string}`)}
						>
							<SanityImage
								image={work.image}
								alt={pick(work.title, 'en') || pick(work.title, 'de') || 'Untitled'}
								width={1000}
								quality={55}
								fit="crop"
								viewTransitionName={transitionWorkId === work._id
									? `work-${work._id}`
									: undefined}
								displayBlurHash={true}
							/>
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
