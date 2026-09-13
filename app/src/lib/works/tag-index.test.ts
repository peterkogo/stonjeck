import { deepStrictEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { availableTags, buildTagIndex } from './tag-index';
import { matchesTagFilters } from './filter-tags.svelte';

function work(...slugs: string[]) {
	return { tags: slugs.map((current) => ({ slug: { current }, group: 'medium' })) };
}

test('mutually exclusive media are disabled and clearing restores them', () => {
	const index = buildTagIndex([work('oil', 'portrait'), work('aquarell', 'landscape')]);
	deepStrictEqual(availableTags(index, ['oil']), new Set(['oil', 'portrait']));
	deepStrictEqual(availableTags(index, []), new Set(index.keys()));
	equal(matchesTagFilters(work('oil').tags, ['oil', 'aquarell']), false);
});

test('pairwise compatibility does not incorrectly allow an impossible triple', () => {
	const index = buildTagIndex([work('a', 'b'), work('a', 'c'), work('b', 'c')]);
	deepStrictEqual(availableTags(index, ['a', 'b']), new Set(['a', 'b']));
	deepStrictEqual(availableTags(index, ['a', 'b', 'c']), new Set());
});

test('null references, duplicate tags, unused tags and unknown URL filters', () => {
	const index = buildTagIndex([
		{ tags: null },
		{ tags: [null, { slug: null }, { slug: {} }] },
		work('oil', 'oil')
	]);
	index.set('unused', []);
	deepStrictEqual(index.get('oil'), [2]);
	deepStrictEqual(availableTags(index, ['unknown']), new Set(['oil']));
	deepStrictEqual(availableTags(index, ['unused']), new Set());
	deepStrictEqual(availableTags(buildTagIndex([]), []), new Set());
});

test('index availability agrees with actual filtering for every subset of tags', () => {
	const slugs = ['a', 'b', 'c', 'd', 'e'];
	const works = [work('a', 'b', 'c'), work('b', 'd'), work('c', 'd', 'e'), work('a', 'e')];
	const index = buildTagIndex(works);
	for (let mask = 0; mask < 1 << slugs.length; mask++) {
		const selected = slugs.filter((_, bit) => mask & (1 << bit));
		const expected = slugs.filter((slug) =>
			works.some((entry) => matchesTagFilters(entry.tags, [...selected, slug]))
		);
		deepStrictEqual(availableTags(index, selected), new Set(expected));
	}
});
