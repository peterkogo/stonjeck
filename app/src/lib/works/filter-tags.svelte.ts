function normalizeFilters(filters: string[]): string[] {
	const normalized = filters.map((filter) => filter.trim()).filter((filter) => filter.length > 0);

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

class FilterTagsState {
	selected = $state<string[]>([]);

	set(filters: string[]) {
		this.selected = normalizeFilters(filters);
	}

	toggle(filter: string): string[] {
		if (this.selected.includes(filter)) {
			this.selected = this.selected.filter((item) => item !== filter);
		} else {
			this.selected = [...this.selected, filter];
		}

		return this.selected;
	}

	clear() {
		this.selected = [];
	}
}

export const filterTagsState = new FilterTagsState();
