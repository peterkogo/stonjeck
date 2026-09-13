<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { afterNavigate, goto, replaceState } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { parseFilterQuery } from '$lib/works/filter-tags.svelte';
	import FilterTags from '$lib/works/FilterTags.svelte';
	import MobileNav from './MobileNav.svelte';
	import type { TagsQueryResult } from '../../sanity.types';
	import type { TagIndex } from '$lib/works/tag-index';
	import { page } from '$app/state';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';

	let { tags, tagIndex }: { tags: TagsQueryResult; tagIndex: TagIndex } = $props();

	const hasFilters = $derived(
		browser && parseFilterQuery(page.url.searchParams.get('filter')).length > 0
	);
	const isAbout = $derived(page.route.id === '/about');
	let mobileFiltersVisible = $state(false);
	let homeSection = $state<'news' | 'works'>('news');
	let visibleSections = $state<'news' | 'works' | 'both'>('news');
	const activeSection = $derived(
		page.route.id === '/'
			? homeSection
			: page.route.id === '/works/[[slug]]'
				? 'works'
				: undefined
	);
	const indicatorSection = $derived(page.route.id === '/' ? visibleSections : activeSection);
	let resizeObserver: ResizeObserver | undefined;
	let navigationFrame: number | undefined;

	function clearSectionHash() {
		if (page.route.id !== '/' || !['#work', '#works', '#news'].includes(page.url.hash)) return;
		// This temporary URL does not participate in reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const url = new URL(page.url);
		url.hash = '';
		// Preserve filters, history state, and scroll without adding another entry.
		// The URL is cloned from the already resolved current page.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		replaceState(url, page.state);
	}

	function navigateBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			// Direct visits have no previous entry; the grid restores the last viewed work.
			void goto(resolve(localizeHref(resolve('/')) as '/'));
		}
	}

	async function navigateToSection(event: MouseEvent, section: 'news' | 'works') {
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		event.preventDefault();
		const href = `${localizeHref(resolve('/'))}${section === 'works' ? '#works' : ''}`;
		if (page.route.id !== '/') {
			await goto(resolve(href as '/'), { noScroll: true });
		}
		const behavior = prefersReducedMotion.current ? 'instant' : 'smooth';
		if (section === 'news') {
			window.scrollTo({ top: 0, behavior });
		} else {
			document.getElementById('works')?.scrollIntoView({ behavior, block: 'start' });
		}
		clearSectionHash();
	}

	function updateSection() {
		if (page.route.id !== '/') return;
		const news = document.getElementById('news');
		const works = document.getElementById('works');
		if (!works) return;

		const newsBounds = news?.getBoundingClientRect();
		const worksBounds = works.getBoundingClientRect();
		const newsVisible =
			newsBounds &&
			newsBounds.height > 0 &&
			newsBounds.bottom > 0 &&
			newsBounds.top < window.innerHeight;
		const worksVisible =
			worksBounds.height > 0 && worksBounds.bottom > 0 && worksBounds.top < window.innerHeight;
		// Reveal mobile filters one tenth of a viewport before News leaves the screen.
		mobileFiltersVisible =
			!newsBounds || newsBounds.height === 0 || newsBounds.bottom <= window.innerHeight * 0.1;
		visibleSections = newsVisible && worksVisible ? 'both' : newsVisible ? 'news' : 'works';

		// Switch when Works reaches the upper part of the viewport, or the page ends.
		const atBottom =
			window.scrollY > 0 &&
			window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
		homeSection =
			!news || worksBounds.top <= window.innerHeight * 0.25 || atBottom ? 'works' : 'news';
	}

	afterNavigate(() => {
		resizeObserver?.disconnect();
		if (navigationFrame !== undefined) cancelAnimationFrame(navigationFrame);
		updateSection();
		navigationFrame = requestAnimationFrame(() => {
			updateSection();
			// Let navigation and the grid consume the anchor before removing it.
			clearSectionHash();
		});
		if (page.route.id !== '/') return;
		resizeObserver = new ResizeObserver(updateSection);
		for (const id of ['news', 'works']) {
			const section = document.getElementById(id);
			if (section) resizeObserver.observe(section);
		}
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		if (navigationFrame !== undefined) cancelAnimationFrame(navigationFrame);
	});
</script>

<svelte:window onscroll={updateSection} onresize={updateSection} />

<MobileNav
	{activeSection}
	{isAbout}
	{navigateToSection}
	{navigateBack}
	{tags}
	{tagIndex}
	{hasFilters}
	showFilters={page.route.id === '/' &&
		(mobileFiltersVisible || hasFilters) &&
		tags.length > 0}
/>

<aside
	class="sidebar bg-background fixed inset-y-0 left-0 z-20 hidden flex-col overflow-y-auto py-5 pl-2 sm:py-8 sm:pl-4 md:flex"
>
	<a
		class=" mt-1 inline-block text-right text-2xl leading-[1.3] font-medium tracking-[-0.035em] whitespace-nowrap focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current"
		href={resolve(localizeHref(resolve('/')) as '/')}
		onclick={(event) => navigateToSection(event, 'news')}>Karim Stonjeck</a
	>
	<nav
		class="mt-3 flex flex-col items-end gap-1 text-right text-xs sm:mt-4 sm:text-[0.8125rem]"
		aria-label={getLocale() === 'de' ? 'Hauptnavigation' : 'Main navigation'}
	>
		<a
			class="nav-link"
			href={resolve(localizeHref(resolve('/about')) as '/about')}
			aria-current={isAbout ? 'page' : undefined}
		>
			{getLocale() === 'de' ? 'Über' : 'About'}
		</a>
		{#if page.route.id === '/works/[[slug]]'}
			<button class="nav-link back-link" type="button" onclick={navigateBack}>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
					<path d="M8 2 4 6 8 10" stroke="currentColor" stroke-width="1" />
				</svg>
				{getLocale() === 'de' ? 'Zurück' : 'Back'}
			</button>
		{:else}
			<div class="section-links" data-active={indicatorSection}>
				<span class="section-track" aria-hidden="true"
					><span class="section-indicator"></span></span
				>
				<a
					class="nav-link"
					href={resolve(localizeHref(resolve('/')) as '/')}
					onclick={(event) => navigateToSection(event, 'news')}
					aria-current={activeSection === 'news' ? 'location' : undefined}
				>
					{getLocale() === 'de' ? 'Aktuelles' : 'News'}
				</a>
				<a
					class="nav-link"
					href={resolve(`${localizeHref(resolve('/'))}#works` as '/')}
					onclick={(event) => navigateToSection(event, 'works')}
					aria-current={activeSection === 'works' ? 'location' : undefined}
				>
					{getLocale() === 'de' ? 'Werke' : 'Works'}
				</a>
			</div>
		{/if}
	</nav>
	{#if page.route.id === '/'}
		{#if (visibleSections === 'works' || hasFilters) && tags.length > 0}
			<!-- Reveal on returning to the overview; only animate exits within this page. -->
			<div
				class="min-w-0 [contain:inline-size]"
				in:slide|global={{
					duration: prefersReducedMotion.current ? 0 : 180,
					easing: cubicOut
				}}
				out:slide={{ duration: prefersReducedMotion.current ? 0 : 180, easing: cubicOut }}
			>
				<FilterTags {tags} {tagIndex} />
			</div>
		{/if}
	{/if}
	<div
		class="text-muted-foreground mt-auto flex items-center justify-end gap-1 pt-8 text-[0.6875rem] whitespace-nowrap sm:gap-[0.35rem] sm:text-[0.8125rem]"
	>
		<button
			class="hover:text-foreground cursor-pointer py-2 hover:underline hover:underline-offset-[0.3em] focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current"
			type="button"
			onclick={() => setLocale(getLocale() === 'de' ? 'en' : 'de')}
		>
			{getLocale() === 'de' ? 'english' : 'deutsch'}
		</button>
	</div>
</aside>

<style>
	.sidebar {
		/* Keep the content edge fixed, with room for the rule beyond it. */
		width: calc(var(--site-sidebar-width) + 1rem);
		padding-right: 1rem;
	}

	.nav-link {
		display: block;
		padding: 0.5rem 0;
		color: var(--muted-foreground);
		transition: color 150ms ease;
	}

	.nav-link:hover,
	.nav-link[aria-current],
	.section-links[data-active='both'] .nav-link {
		color: var(--foreground);
	}

	.nav-link:focus-visible {
		outline: 1px solid currentColor;
		outline-offset: 3px;
	}

	.back-link {
		display: flex;
		cursor: pointer;
		align-items: center;
		gap: 0.375rem;
	}

	.section-links {
		position: relative;
	}

	.section-track {
		position: absolute;
		inset: 0 -0.75rem 0 auto;
		width: 1px;
		background: color-mix(in oklch, var(--foreground) 15%, transparent);
	}

	.section-indicator {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 50%;
		background: var(--foreground);
		opacity: 0;
		transition:
			top 200ms ease,
			height 200ms ease,
			opacity 150ms ease;
	}

	.section-links[data-active] .section-indicator {
		opacity: 1;
	}

	.section-links[data-active='works'] .section-indicator {
		top: 50%;
	}

	.section-links[data-active='both'] .section-indicator {
		height: 100%;
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-link,
		.section-indicator {
			transition: none;
		}
	}
</style>
