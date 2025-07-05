<script lang="ts">
	import '../app.css';
	import { getLocale, locales, localizeHref, setLocale } from '$lib/paraglide/runtime';
	import type { Snippet } from 'svelte';
	import { type PageData } from './$types';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { type ClassValue } from 'svelte/elements';
	import { m } from '$lib/paraglide/messages';

	let { data, children }: { data: PageData; children: Snippet } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	function toggleLocale() {
		setLocale(getLocale() === 'en' ? 'de' : 'en');
	}
</script>

<!-- This is for paraglide.js -->
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

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
			data-sveltekit-preload-code="eager"
			class={[
				'block cursor-pointer font-light tracking-wide hover:text-gray-900',
				{ 'font-medium tracking-normal text-gray-900': path === link }
			]}
		>
			{title}
		</a>
	</div>
{/snippet}

<div class="flex min-h-screen">
	<aside class="flex flex-col p-8 pr-0">
		<a href="/" class="relative mb-4 block">
			<h1 class="mb-8 whitespace-nowrap text-2xl font-semibold text-gray-900">Karim Stonjeck</h1>
			<div
				class="absolute left-0 top-0 size-[6px] translate-x-[38px] translate-y-[5px] rounded-full bg-white"
			></div>
			{#if page.url.pathname === '/'}
				{@render dot('absolute top-0 left-0 translate-x-[39px] translate-y-[6px]')}
			{/if}
		</a>

		<div class="flex flex-col space-y-3 text-sm text-gray-400">
			{@render item(m['ui.biography'](), '/bio', page.url.pathname)}
			{#each data.series as series}
				{@render item(m[series._id](), `/${series.slug?.current}`, page.url.pathname)}
			{/each}
			<div
				class="absolute bottom-5 left-10 mt-auto flex items-center justify-end font-light tracking-wide hover:text-gray-900"
			>
				<div
					class="right-0 cursor-pointer"
					onclick={toggleLocale}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							toggleLocale();
						}
					}}
					role="button"
					tabindex="0"
					aria-label={getLocale() === 'en' ? 'Switch to German' : 'Switch to English'}
				>
					<span class={{ 'font-bold': getLocale() === 'de' }}>de</span> |
					<span class={{ 'font-bold': getLocale() === 'en' }}>en</span>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
