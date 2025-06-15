<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { type PageData } from './$types';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { type ClassValue } from 'svelte/elements';

	let { data, children }: { data: PageData; children: Snippet } = $props();

	// Helper function to get title in preferred language (defaulting to English)
	function getTitle(titleArray: any[]) {
		const englishTitle = titleArray.find((t) => t._key === 'de');
		return englishTitle?.value || titleArray[0]?.value || 'Untitled';
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{#snippet dot(classes?: ClassValue)}
	<div
		class={['mr-2 inline size-1 rounded-full bg-gray-900', classes]}
		style:view-transition-name="dot"
	></div>
{/snippet}

{#snippet item(title: string, link: string, path: string)}
	<div class="flex items-center justify-end">
		{#if path === link}
			{@render dot()}
		{/if}
		<a
			href={link}
			class={[
				'block cursor-pointer text-sm font-light tracking-wide text-gray-400  hover:text-gray-900',
				{ 'font-medium tracking-normal text-gray-900': path === link }
			]}
		>
			{title}
		</a>
	</div>
{/snippet}

<div class="flex min-h-screen">
	<!-- Transparent Sidebar -->
	<aside class="w-[241px] p-8">
		<a href="/" class="relative mb-8 block">
			<h1 class="mb-8 text-2xl font-bold text-gray-900">Karim Stonjeck</h1>
			<div
				class="absolute left-0 top-0 size-[6px] translate-x-[39px] translate-y-[5px] rounded-full bg-white"
			></div>
			{#if page.url.pathname === '/'}
				{@render dot('absolute top-0 left-0 translate-x-[40px] translate-y-[6px]')}
			{/if}
		</a>

		<div class="flex flex-col space-y-3">
			{@render item('Biographie', '/biographie', page.url.pathname)}
			{#each data.series as series}
				{@render item(getTitle(series.title), `/${series.slug.current}`, page.url.pathname)}
			{/each}
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
