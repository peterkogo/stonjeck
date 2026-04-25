<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { type ClassValue } from 'svelte/elements';
	import Lang from '$lib/components/Lang.svelte';
	import { lang, type LangText } from '$lib/lang';
	import { getSeriesList } from '$lib/data.remote';
	import { type ResolvedPathname } from '$app/types';

	let { children }: { children: Snippet } = $props();

	let isEn = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('lang');
		if (stored === 'en') {
			document.documentElement.classList.add('lang-en');
			isEn = true;
		}
	});

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
		const next = !isEn;
		document.documentElement.classList.toggle('lang-en', next);
		localStorage.setItem('lang', next ? 'en' : 'de');
		isEn = next;
	}
</script>

{#snippet dot(classes?: ClassValue)}
	<div
		class={['mr-2 inline size-1 rounded-full bg-gray-900', classes]}
		style:view-transition-name="dot"
	></div>
{/snippet}

{#snippet item(title: LangText, link: ResolvedPathname, path: string)}
	<div class="flex items-center justify-end">
		{#if path === link}
			{@render dot()}
		{/if}
		<a
			// @ts-expect-error - link is a ResolvedPathname
			href={resolve(link)}
			data-sveltekit-preload-code="eager"
			class={[
				'block cursor-pointer font-light tracking-wide hover:text-gray-900',
				{ 'font-medium tracking-normal text-gray-900': path === link }
			]}
		>
			<Lang text={title} />
		</a>
	</div>
{/snippet}

<div class="flex min-h-screen">
	<aside class="flex flex-col p-8 pr-0">
		<a href={resolve('/')} class="relative mb-4 block">
			<h1 class="mb-8 text-2xl font-semibold whitespace-nowrap text-gray-900">Karim Stonjeck</h1>
			<div
				class="absolute top-0 left-0 size-[6px] translate-x-[38px] translate-y-[5px] rounded-full bg-white"
			></div>
			{#if page.url.pathname === '/'}
				{@render dot('absolute top-0 left-0 translate-x-[39px] translate-y-[6px]')}
			{/if}
		</a>

		<div class="flex flex-col space-y-3 text-sm text-gray-400">
			{@render item(lang('Biographie', 'Biography'), '/bio', page.url.pathname)}
			{#each await getSeriesList() as series (series._id)}
				{@render item(series.title, resolve(`/${series.slug?.current}`), page.url.pathname)}
			{/each}
			<div
				class="absolute bottom-5 left-10 mt-auto flex items-center justify-end font-light tracking-wide hover:text-gray-900"
			>
				<button
					type="button"
					class="right-0 cursor-pointer"
					onclick={toggleLocale}
					aria-label={isEn ? 'Switch to German' : 'Switch to English'}
				>
					<span class={{ 'font-bold': !isEn }}>de</span> |
					<span class={{ 'font-bold': isEn }}>en</span>
				</button>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
