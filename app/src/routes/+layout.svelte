<script lang="ts">
	import { type Snippet } from 'svelte';
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import { getTags, getTagIndex } from '$lib/data.remote';

	const [tags, tagIndex] = await Promise.all([getTags(), getTagIndex()]);

	let { children }: { children: Snippet } = $props();
</script>

<NavBar {tags} {tagIndex} />
<main>
	{@render children()}
</main>

<style>
	:global(:root) {
		--site-sidebar-width: 0px;
	}

	main {
		min-width: 0;
		min-height: 100svh;
		margin-left: var(--site-sidebar-width);
	}

	@media (min-width: 48rem) {
		:global(:root) {
			--site-sidebar-width: 12rem;
		}
	}
</style>
