import type {
	InternationalizedArrayString,
	InternationalizedArrayText
} from '../sanity.types';
import { getLocale } from './paraglide/runtime';

export type LangText =
	InternationalizedArrayString | InternationalizedArrayText | null | undefined;

export function pick(text: LangText, language: 'de' | 'en'): string {
	if (!text) return '';
	return text.find((item) => item.language === language)?.value ?? text[0]?.value ?? '';
}

export function isEnglish() {
	return getLocale() === 'en';
}

export function multilang(de: string, en: string): InternationalizedArrayString {
	return [
		{ _key: 'de', _type: 'internationalizedArrayStringValue', language: 'de', value: de },
		{ _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en }
	];
}
