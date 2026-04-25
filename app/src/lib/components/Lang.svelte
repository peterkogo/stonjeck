<script lang="ts">
	import { pick, type LangText } from '$lib/lang';

	let { text, html = false }: { text: LangText; html?: boolean } = $props();

	const de = $derived(pick(text, 'de') || pick(text, 'en'));
	const en = $derived(pick(text, 'en') || pick(text, 'de'));
</script>

<span class="lang-overlay">
	{#if html}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<span lang="de">{@html de}</span><!-- eslint-disable-next-line svelte/no-at-html-tags --><span lang="en">{@html en}</span>
	{:else}
		<span lang="de">{de}</span><span lang="en">{en}</span>
	{/if}
</span>

<style>
	.lang-overlay {
		display: contents;
	}
	:global(html:not(.lang-en)) .lang-overlay > [lang='en'],
	:global(html.lang-en) .lang-overlay > [lang='de'] {
		display: none;
	}
</style>
