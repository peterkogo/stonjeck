type TaggedWork = {
	tags: ({ slug: { current?: string } | null } | null)[] | null;
};

// Numeric work positions keep the prerendered payload compact. Each posting list
// is sorted and unique, and its size grows with actual tag assignments, not 2^tags.
export type TagIndex = Map<string, number[]>;

export function buildTagIndex(works: TaggedWork[]): TagIndex {
	const index: TagIndex = new Map();
	works.forEach((work, position) => {
		const slugs = new Set(work.tags?.map((tag) => tag?.slug?.current));
		for (const slug of slugs) {
			if (!slug) continue;
			const positions = index.get(slug) ?? [];
			positions.push(position);
			index.set(slug, positions);
		}
	});
	return index;
}

export function availableTags(index: TagIndex, selected: string[]): Set<string> {
	// Unknown URL filters are ignored, just as in the grid.
	const lists = selected
		.filter((slug) => index.has(slug))
		.map((slug) => index.get(slug)!)
		.sort((a, b) => a.length - b.length);
	if (lists.length === 0) {
		return new Set(
			[...index].filter(([, positions]) => positions.length > 0).map(([slug]) => slug)
		);
	}

	let matches = new Set(lists[0]);
	for (const list of lists.slice(1)) {
		matches = new Set(list.filter((position) => matches.has(position)));
		if (matches.size === 0) break;
	}
	return new Set(
		[...index]
			.filter(([, positions]) => positions.some((position) => matches.has(position)))
			.map(([slug]) => slug)
	);
}
