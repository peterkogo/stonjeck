<script lang="ts">
	import { type Snippet } from 'svelte';
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<NavBar />
<main>
	{@render children()}
</main>

<style>
	:global(:root) {
		--site-sidebar-width: 8rem;
	}

	main {
		min-width: 0;
		min-height: 100dvh;
		margin-left: var(--site-sidebar-width);
	}

	@media (max-width: 639px) {
		:global(:root) {
			--site-sidebar-width: 6rem;
		}
	}
</style>
