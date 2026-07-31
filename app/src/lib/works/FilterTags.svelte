<script lang="ts">
	import { afterNavigate, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { SeriesListQueryResult } from '../../sanity.types';
	import Lang from '../components/Lang.svelte';
	import { filterTagsState, parseFilterQuery, stringifyFilterQuery } from './filter-tags.svelte';

	let { seriesList }: { seriesList: SeriesListQueryResult } = $props();

	type SeriesTag = {
		_id: string;
		title: SeriesListQueryResult[number]['title'];
		slug: string;
	};

	const tags = $derived(
		seriesList.flatMap((series): SeriesTag[] => {
			const slug = series.slug?.current;
			if (!slug) return [];

			return [{ _id: series._id, title: series.title, slug }];
		})
	);
	const availableTagSlugs = $derived(new Set(tags.map((tag) => tag.slug)));

	function syncFiltersFromUrl(url: URL) {
		const queryFilters = parseFilterQuery(url.searchParams.get('filter')).filter((filter) =>
			availableTagSlugs.has(filter)
		);

		filterTagsState.set(queryFilters);
	}

	syncFiltersFromUrl(page.url);

	afterNavigate(() => {
		syncFiltersFromUrl(page.url);
	});

	function toggleFilter(filter: string) {
		const nextFilters = filterTagsState.toggle(filter);
		const query = stringifyFilterQuery(nextFilters);
		const nextUrl = new URL(page.url);

		if (query.length > 0) {
			nextUrl.searchParams.set('filter', query);
		} else {
			nextUrl.searchParams.delete('filter');
		}

		replaceState(
			// Filter query updates keep the current path; RouteId union can't express arbitrary pathname+search
			// @ts-expect-error pathname+search is valid at runtime
			resolve(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`),
			page.state
		);
	}

	function clearFilters() {
		filterTagsState.clear();
		const nextUrl = new URL(page.url);
		nextUrl.searchParams.delete('filter');
		replaceState(
			// Filter query updates keep the current path; RouteId union can't express arbitrary pathname+search
			// @ts-expect-error pathname+search is valid at runtime
			resolve(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`),
			page.state
		);
	}
</script>

<div class="flex flex-col gap-2 pt-3">
	<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Filter</p>

	<div class="flex flex-col gap-1.5">
		{#each tags as tag (tag._id)}
			<button
				type="button"
				class={[
					'cursor-pointer text-left text-sm font-light tracking-wide transition-colors hover:text-gray-900',
					filterTagsState.selected.includes(tag.slug) ? 'text-gray-900' : 'text-gray-400'
				]}
				onclick={() => toggleFilter(tag.slug)}
			>
				<Lang text={tag.title} />
			</button>
		{/each}
	</div>

	{#if filterTagsState.selected.length > 0}
		<button
			type="button"
			class="mt-1 cursor-pointer text-left text-xs text-gray-500 hover:text-gray-900"
			onclick={clearFilters}
		>
			Clear filters
		</button>
	{/if}
</div>
