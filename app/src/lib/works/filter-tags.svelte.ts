function normalizeFilters(filters: string[]): string[] {
	const normalized = filters
		.map((filter) => filter.trim())
		.filter((filter) => filter.length > 0);

	return [...new Set(normalized)];
}

const filterQuerySeparator = '~';

export function parseFilterQuery(value: string | null): string[] {
	if (!value) return [];
	return normalizeFilters(value.split(filterQuerySeparator));
}

export function stringifyFilterQuery(filters: string[]): string {
	return normalizeFilters(filters).join(filterQuerySeparator);
}

// Groups organize the controls; every selected tag must match the same work.
export function matchesTagFilters(
	tags: ({ slug: { current?: string } | null; group: string | null } | null)[] | null,
	selected: string[]
): boolean {
	const slugs = tags?.map((tag) => tag?.slug?.current) ?? [];
	return selected.every((slug) => slugs.includes(slug));
}
