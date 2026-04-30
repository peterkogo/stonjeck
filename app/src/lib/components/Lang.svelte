<script lang="ts">
	import { pick, type LangText } from '$lib/lang';
	import { getLocale } from '$lib/paraglide/runtime';

	let { text, html = false }: { text: LangText; html?: boolean } = $props();

	const localizedText = $derived(pick(text, getLocale()));
</script>

{#if html}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html localizedText}
{:else}
	{localizedText}
{/if}
