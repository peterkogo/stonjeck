<script lang="ts">
	import '../app.css';
	import { type Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { type ClassValue } from 'svelte/elements';
	import FilterTags from '$lib/works/FilterTags.svelte';
	import MorphFloatingSurface from '$lib/components/MorphFloatingSurface.svelte';
	import { isEnglish, type LangText } from '$lib/lang';
	import { getSeriesList } from '$lib/data.remote';
	import { getLocale, locales, localizeHref, setLocale } from '$lib/paraglide/runtime';

	let { children }: { children: Snippet } = $props();
	const seriesList = await getSeriesList();

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

	const morphBlurbs = [
		'Studio playlist: still on shuffle.',
		'Last pigment restock: longer ago than it should be.',
		'Frames considered today: more than zero.',
		'Coffee status: hot enough to matter.'
	];
	let morphBlurb = $state(morphBlurbs[0]);
	onMount(() => {
		morphBlurb = morphBlurbs[Math.floor(Math.random() * morphBlurbs.length)];
	});
</script>

{#snippet dot(classes?: ClassValue)}
	<div
		class={['mr-2 inline size-1 rounded-full bg-gray-900', classes]}
		style:view-transition-name="dot"
	></div>
{/snippet}

{#snippet item(title: LangText, href: string, path: string)}
	<div class="flex items-center justify-end">
		{#if path === href}
			{@render dot()}
		{/if}
		<a
			href={resolve(href as `/${string}`)}
			data-sveltekit-preload-code="eager"
			class={[
				'hover:text-gray-900x` block hidden cursor-pointer font-light tracking-wide',
				{ 'font-medium tracking-normal text-gray-900': path === href }
			]}
		>
			<!-- <Lang text={title} /> -->
		</a>
	</div>
{/snippet}

<!-- <aside
	class="fixed top-0 left-0 z-20 flex h-dvh w-64 shrink-0 flex-col bg-white p-8 pr-6"
	aria-label="Site navigation"
>
	<a href={resolve('/')} class="relative mb-4 block shrink-0">
		<h1 class="mb-8 text-2xl font-semibold whitespace-nowrap text-gray-900">Karim Stonjeck</h1>
		<div
			class="absolute top-0 left-0 size-[6px] translate-x-[38px] translate-y-[5px] rounded-full bg-white"
		></div>
		{#if page.url.pathname === '/'}
			{@render dot('absolute top-0 left-0 translate-x-[39px] translate-y-[6px]')}
		{/if}
	</a>

	<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto text-sm text-gray-400">
		{@render item(
			multilang('Biographie', 'Biography'),
			localizeHref('/bio', { locale: getLocale() }),
			page.url.pathname
		)}
		{#each await getSeriesList() as series (series._id)}
			{@render item(
				series.title,
				localizeHref(`/${series.slug.current}`, { locale: getLocale() }),
				page.url.pathname
			)}
		{/each}
		<FilterTags {seriesList} />
	</div>

	<div class="mt-auto shrink-0 pt-6 font-light tracking-wide hover:text-gray-900">
		<button
			type="button"
			class="cursor-pointer text-left"
			onclick={toggleLocale}
			aria-label={isEnglish() ? 'Switch to German' : 'Switch to English'}
		>
			{#each locales as locale (locale)}
				<a
					href={resolve(localizeHref(page.url.pathname, { locale }) as `/${string}`)}
					data-sveltekit-reload
					style:display={locale === getLocale() ? 'block' : 'none'}
				>
					>{locale === 'en' ? 'deutsch' : 'english'}
				</a>
			{/each}
			<span class={{ 'font-bold': !isEnglish() }}>de</span> |
			<span class={{ 'font-bold': isEnglish() }}>en</span>
		</button>
		<nav class="locale-switcher" aria-label="Languages">
			{#each locales as locale (locale)}
				<a href={resolve(localizeHref(page.url.pathname, { locale }))} data-sveltekit-reload>
					{locale}
				</a>
			{/each}
		</nav>
	</div>
</aside> -->

<!-- Main Content: offset for fixed sidebar; page scrolls on the document -->
<main class="min-h-dvh">
	{@render children()}
</main>

<!-- <button
	type="button"
	class="absolute top-0 left-0 cursor-pointer text-left"
	onclick={toggleLocale}
	aria-label={isEnglish() ? 'Switch to German' : 'Switch to English'}
>
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as `/${string}`)}
			data-sveltekit-reload
			style:display={locale === getLocale() ? 'block' : 'none'}
		>
			>{locale === 'en' ? 'deutsch' : 'english'}
		</a>
	{/each}
</button> -->

<!-- <MorphFloatingSurface
	panelTitle="Quick actions"
	expandedWidth={340}
	expandedHeight={320}
	surfaceId="layout-quick-actions"
>
	<p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
		This is placeholder content for the morphing panel. You can swap it for contact links,
		newsletter signup, or anything else.
	</p>
	<p class="mt-2 text-xs text-neutral-500 italic dark:text-neutral-400">
		{morphBlurb}
	</p>
	<p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
		Tip: <kbd
			class="rounded bg-neutral-300 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-600"
			>Esc</kbd
		>
		closes the card; click outside works too.
	</p>
	<div class="mt-5 flex flex-wrap gap-2">
		<button
			type="button"
			class="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
		>
			Primary
		</button>
		<button
			type="button"
			class="rounded-full border border-neutral-300 bg-transparent px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
		>
			Secondary
		</button>
		<a
			href={resolve('/works')}
			class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
		>
			View works
		</a>
	</div>
</MorphFloatingSurface> -->
