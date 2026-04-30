<script lang="ts">
	import { resolve } from '$app/paths';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { WorksQueryResult } from '../../sanity.types';
	import Work from './Work.svelte';
	import { filterTagsState } from './filter-tags.svelte';
	import { cubicInOut, cubicIn } from 'svelte/easing';
	import { localizeHref } from '$lib/paraglide/runtime';

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

	let transitionWorkId = $state<string | undefined>(undefined);
</script>

<!-- <svelte:window onpointerup={cleanTransitionWorkId} onpointercancel={cleanTransitionWorkId} /> -->

<div class="w-full overflow-x-hidden p-5 lg:p-8">
	<div
		class="grid overflow-visible [--frame-width:160px] md:[--frame-width:260px]"
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
			<div style:position="absolute" style:inset="calc(var(--gap, 0) / 2)">
				<h1 class="mb-8 w-full font-semibold text-gray-900" aria-label="Karim Stonjeck">
					<svg
						class="block w-full"
						viewBox="0 0 1000 200"
						preserveAspectRatio="xMidYMid meet"
						aria-hidden="true"
						focusable="false"
					>
						<text
							x="0"
							y="132"
							fill="currentColor"
							font-family="'DM Sans', sans-serif"
							font-size="112"
							font-weight="600"
							textLength="1000"
							lengthAdjust="spacing"
						>
							Karim Stonjeck
						</text>
					</svg>
				</h1>
			</div>
		</div>
		{#each filteredWorks as work (work._id)}
			{@const dimensions = work.image.asset.metadata.dimensions}
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
							href={resolve(
								localizeHref(`/works#${slug}` as `/works#${string}`) as `/works#${string}`
							)}
						>
							<Work {work} transition={undefined} />
						</a>
					{:else}
						<Work {work} />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
