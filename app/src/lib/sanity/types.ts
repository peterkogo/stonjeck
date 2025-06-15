import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

type Slug = {
	current: string;
};

export interface InternationalizedString {
	_key: string;
	value: string;
}

export interface InternationalizedText {
	_key: string;
	value: string;
}

export interface Medium {
	_id: string;
	_type: 'medium';
	_rev: string;
	_createdAt: string;
	_updatedAt: string;
	name: InternationalizedString[];
}

export interface Work {
	_id: string;
	title: InternationalizedString[];
	slug: Slug;
	image: SanityImageSource;
	date: `${number}-${number}-${number}`;
	size: string;
	medium: Medium;
	description?: InternationalizedText[];
}

export interface Series {
	_id: string;
	title: InternationalizedString[];
	slug: Slug;
	description?: InternationalizedText[];
	year: number;
	works?: Work[];
}

export type SupportedLanguage = 'en' | 'de';

export interface LocalizedContent<T> {
	[key: string]: T;
}

// Helper function to get localized content
export function getLocalizedValue(
	content: InternationalizedString[] | InternationalizedText[] | undefined,
	language: SupportedLanguage = 'en',
	fallback: SupportedLanguage = 'en'
): string {
	if (!content || !Array.isArray(content)) return '';

	const preferred = content.find((item) => item._key === language)?.value;
	if (preferred) return preferred;

	const fallbackValue = content.find((item) => item._key === fallback)?.value;
	return fallbackValue || '';
}
