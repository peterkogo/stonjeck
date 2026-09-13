<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteMap } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import { pick } from '$lib/lang';
	import type { TagsQueryResult } from '../../sanity.types';
	import { parseFilterQuery, stringifyFilterQuery } from './filter-tags.svelte';
	import { availableTags, type TagIndex } from './tag-index';

	let {
		tags,
		tagIndex,
		mobile = false
	}: { tags: TagsQueryResult; tagIndex: TagIndex; mobile?: boolean } = $props();
	const selected = $derived(
		browser ? parseFilterQuery(page.url.searchParams.get('filter')) : []
	);
	const available = $derived(availableTags(tagIndex, selected));
	const groups = $derived.by(() => {
		const grouped = new SvelteMap<string, TagsQueryResult>();
		for (const tag of tags) {
			if (!tag.slug?.current) continue;
			const group = tag.group?.trim() ?? '';
			grouped.set(group, [...(grouped.get(group) ?? []), tag]);
		}
		return [...grouped.entries()];
	});

	function setFilters(filters: string[]) {
		const url = new URL(page.url);
		const query = stringifyFilterQuery(filters);
		if (query) url.searchParams.set('filter', query);
		else url.searchParams.delete('filter');
		// The URL is cloned from the already resolved current page.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void goto(url, { replaceState: true, noScroll: true, keepFocus: true });
	}

	function toggle(slug: string) {
		if (!selected.includes(slug) && !available.has(slug)) return;
		setFilters(
			selected.includes(slug)
				? selected.filter((value) => value !== slug)
				: [...selected, slug]
		);
	}
</script>

<div
	class:mobile
	class="flex w-full min-w-0 flex-col gap-3 pt-5 text-right text-[0.5625rem] leading-tight sm:text-[0.625rem]"
	aria-label={getLocale() === 'de' ? 'Werke filtern' : 'Filter works'}
>
	{#if !mobile}
		<button
			type="button"
			disabled={selected.length === 0}
			class:invisible={selected.length === 0}
			onclick={() => setFilters([])}
			class="text-muted-foreground hover:text-foreground cursor-pointer py-1 text-right underline underline-offset-4"
		>
			{getLocale() === 'de' ? 'Filter zurücksetzen' : 'Clear filters'}
		</button>
	{/if}
	<div class="tag-groups flex flex-col gap-3">
		{#each groups as [group, tags] (group)}
			<div class="flex w-full min-w-0 flex-wrap justify-end gap-1">
				{#each tags as tag (tag._id)}
					{@const slug = tag.slug!.current!}
					<button
						type="button"
						aria-pressed={selected.includes(slug)}
						disabled={!selected.includes(slug) && !available.has(slug)}
						onclick={() => toggle(slug)}
						class="text-muted-foreground border-foreground/15 enabled:hover:border-foreground/40 enabled:aria-[pressed=false]:hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:border-foreground max-w-full min-w-0 cursor-pointer rounded-full border px-1.5 py-1 text-center [overflow-wrap:anywhere] transition-colors focus-visible:outline focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none"
					>
						{pick(tag.name, getLocale()) || slug}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.mobile {
		padding: 0.625rem 0.5rem 1rem;
		gap: 0.5rem;
		font-size: 0.75rem;
	}
	.mobile .tag-groups {
		gap: 1rem;
	}
	.mobile .tag-groups > div {
		justify-content: flex-end;
	}
	.mobile .tag-groups button {
		padding: 0.25rem 0.625rem;
	}
</style>
