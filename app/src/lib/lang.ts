import type {
	InternationalizedArrayString,
	InternationalizedArrayText
} from '../sanity.types';

export type LangText =
	InternationalizedArrayString | InternationalizedArrayText | null | undefined;

export function pick(text: LangText, language: 'de' | 'en'): string {
	if (!text) return '';
	return text.find((item) => item.language === language)?.value ?? text[0]?.value ?? '';
}
