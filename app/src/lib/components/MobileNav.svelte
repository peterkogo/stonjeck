<script lang="ts">
	import Bowser from 'bowser';
	import { onMount } from 'svelte';
	import FilterTags from '$lib/works/FilterTags.svelte';
	import type { TagsQueryResult } from '../../sanity.types';
	import type { TagIndex } from '$lib/works/tag-index';
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';

	let {
		activeSection,
		isAbout,
		navigateToSection,
		navigateBack,
		tags,
		tagIndex,
		showFilters,
		hasFilters
	}: {
		activeSection: 'news' | 'works' | undefined;
		isAbout: boolean;
		tags: TagsQueryResult;
		tagIndex: TagIndex;
		showFilters: boolean;
		hasFilters: boolean;
		navigateToSection: (event: MouseEvent, section: 'news' | 'works') => Promise<void>;
		navigateBack: () => void;
	} = $props();

	const showBack = $derived(isAbout || page.route.id === '/works/[[slug]]');
	let open = $state(false);
	let contentHeight = $state(0);
	let container: HTMLDivElement;
	let toggle = $state<HTMLButtonElement>();
	let useNonIosPosition = $state(false);

	onMount(() => {
		useNonIosPosition = Bowser.getParser(navigator.userAgent).getOSName() !== 'iOS';
	});

	function resetFilters() {
		const url = new URL(page.url);
		url.searchParams.delete('filter');
		// The URL is cloned from the already resolved current page.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void goto(url, { replaceState: true, noScroll: true, keepFocus: true });
	}

	function close(restoreFocus = false) {
		open = false;
		if (restoreFocus) toggle?.focus();
	}

	afterNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) close();
	});
</script>

<svelte:window
	onpointerdown={(event) => {
		if (open && event.target instanceof Node && !container.contains(event.target)) close();
	}}
	onkeydown={(event) => {
		if (open && event.key === 'Escape') close(true);
	}}
	onresize={() => {
		if (window.innerWidth >= 768) {
			close();
		}
	}}
/>

<div
	class="mobile-nav"
	class:non-ios={useNonIosPosition}
	class:open={open && !showBack}
	class:with-filters={showFilters && !showBack}
	style:height={open && !showBack ? `${contentHeight + 60}px` : '3rem'}
	bind:this={container}
	onfocusout={(event) => {
		if (event.relatedTarget instanceof Node && !container.contains(event.relatedTarget))
			close();
	}}
>
	{#if showBack}
		<button
			class="toggle"
			type="button"
			aria-label={getLocale() === 'de' ? 'Zurück' : 'Back'}
			onclick={navigateBack}
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<path d="m11 4-6 6 6 6M5 10h11" stroke="currentColor" stroke-width="1.5" />
			</svg>
		</button>
	{:else}
		<button
			bind:this={toggle}
			class="toggle"
			type="button"
			aria-label={getLocale() === 'de'
				? open
					? 'Menü schließen'
					: 'Menü öffnen'
				: open
					? 'Close menu'
					: 'Open menu'}
			aria-expanded={open}
			aria-controls="mobile-navigation"
			aria-describedby={hasFilters ? 'mobile-filter-status' : undefined}
			onclick={() => {
				open = !open;
			}}
		>
			<span class="filter-label" aria-hidden="true">
				<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
					<path
						d="M2 4h16M5 10h10M8 16h4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				Filter
			</span>
			<span class="hamburger" aria-hidden="true"><span></span><span></span><span></span></span>
			{#if hasFilters}
				<span class="filter-dot" aria-hidden="true"></span>
				<span id="mobile-filter-status" class="sr-only"
					>{getLocale() === 'de' ? 'Filter aktiv' : 'Filters applied'}</span
				>
			{/if}
		</button>
		<nav
			id="mobile-navigation"
			bind:clientHeight={contentHeight}
			aria-label={getLocale() === 'de' ? 'Hauptnavigation' : 'Main navigation'}
			inert={!open}
		>
			<a
				href={resolve(localizeHref(resolve('/about')) as '/about')}
				aria-current={isAbout ? 'page' : undefined}
				onclick={() => close(true)}>{getLocale() === 'de' ? 'Über' : 'About'}</a
			>
			<a
				href={resolve(localizeHref(resolve('/')) as '/')}
				aria-current={activeSection === 'news' ? 'location' : undefined}
				onclick={(event) => {
					close(true);
					void navigateToSection(event, 'news');
				}}>{getLocale() === 'de' ? 'Aktuelles' : 'News'}</a
			>
			<a
				href={resolve(`${localizeHref(resolve('/'))}#works` as '/')}
				aria-current={activeSection === 'works' ? 'location' : undefined}
				onclick={(event) => {
					close(true);
					void navigateToSection(event, 'works');
				}}>{getLocale() === 'de' ? 'Werke' : 'Works'}</a
			>
			<div class="filters" class:shown={showFilters} inert={!open || !showFilters}>
				<div class="filters-inner"><FilterTags {tags} {tagIndex} mobile /></div>
			</div>
		</nav>
		<button
			class="language"
			inert={!open}
			type="button"
			onclick={() => {
				close();
				setLocale(getLocale() === 'de' ? 'en' : 'de');
			}}>{getLocale() === 'de' ? 'english' : 'deutsch'}</button
		>
		<button
			class="reset"
			class:available={showFilters}
			inert={!open || !showFilters}
			type="button"
			disabled={!hasFilters}
			onclick={resetFilters}
			>{getLocale() === 'de' ? 'Filter zurücksetzen' : 'Clear filters'}</button
		>
	{/if}
</div>

<style>
	.mobile-nav {
		--menu-width: min(13rem, calc(100vw - 2rem));
		position: fixed;
		z-index: 50;
		right: max(34px, env(safe-area-inset-right));
		bottom: max(6px, calc(env(safe-area-inset-bottom) - 1rem + 6px));
		width: 3rem;
		height: 3rem;
		overflow: hidden;
		border: 1px solid color-mix(in oklch, var(--foreground) 10%, transparent);
		border-radius: 1.5rem;
		background: color-mix(in oklch, white 65%, transparent);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 24px rgb(0 0 0 / 10%);
		transition:
			width 280ms cubic-bezier(0.2, 0, 0, 1),
			height 280ms cubic-bezier(0.2, 0, 0, 1);
	}

	.mobile-nav.non-ios {
		right: max(26px, env(safe-area-inset-right));
		bottom: max(14px, calc(env(safe-area-inset-bottom) - 1rem + 14px));
	}

	.mobile-nav.open {
		width: var(--menu-width);
	}

	.mobile-nav.with-filters {
		--menu-width: min(
			22rem,
			calc(100vw - 68px - env(safe-area-inset-left) - env(safe-area-inset-right))
		);
		width: 9.5rem;
	}
	.mobile-nav.open.with-filters {
		width: var(--menu-width);
	}
	.filter-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: absolute;
		left: 1.25rem;
		white-space: nowrap;
		font-size: 0.9375rem;
		font-weight: 400;
		letter-spacing: normal;
		line-height: inherit;
		color: var(--foreground);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 60ms ease-out,
			visibility 0s;
	}
	.with-filters:not(.open) .filter-label {
		opacity: 1;
		visibility: visible;
		/* Wait until the pill has room for the label beside the icon. */
		transition:
			opacity 120ms ease-out 180ms,
			visibility 0s 180ms;
	}
	.mobile-nav:not(.open) .toggle {
		width: 100%;
	}
	.filters {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		visibility: hidden;
		/* Keep the final height measurable, but hide tags as soon as closing starts. */
		transition:
			opacity 60ms ease-out,
			visibility 0s;
	}
	.filters.shown {
		grid-template-rows: 1fr;
	}
	.open .filters.shown {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 120ms ease-out 280ms,
			visibility 0s 280ms;
	}
	.filters-inner {
		min-height: 0;
		overflow: hidden;
	}

	.toggle {
		position: absolute;
		right: 0;
		bottom: 0;
		display: grid;
		place-items: center;
		width: calc(3rem - 2px);
		height: calc(3rem - 2px);
		border-radius: 1.5rem;
		cursor: pointer;
	}

	.filter-dot {
		position: absolute;
		top: 0.625rem;
		right: 0.625rem;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		background: var(--foreground);
	}

	.hamburger {
		position: absolute;
		top: 50%;
		right: calc((3rem - 2px - 20px) / 2);
		transform: translateY(-50%) scale(0.9);
		width: 20px;
		height: 15.5px;
	}
	.hamburger span {
		position: absolute;
		left: 0;
		width: 20px;
		height: 1.5px;
		border-radius: 1px;
		background: currentColor;
		transition:
			transform 150ms ease-out,
			opacity 100ms ease-out;
	}
	.hamburger span:nth-child(1) {
		top: 0;
	}
	.hamburger span:nth-child(2) {
		top: 7px;
	}
	.hamburger span:nth-child(3) {
		top: 14px;
	}
	.open .hamburger span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}
	.open .hamburger span:nth-child(2) {
		opacity: 0;
	}
	.open .hamburger span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	nav {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		/* Keep wrapping stable while the surrounding shell expands. */
		width: calc(var(--menu-width) - 1.5rem - 2px);
		opacity: 0;
		visibility: hidden;
		transform: translateY(8px);
		transition:
			opacity 100ms ease-out,
			transform 150ms ease-out,
			visibility 180ms;
	}
	.open nav,
	.open .language,
	.open .reset.available {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
	nav a {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.5rem 0.875rem;
		border-radius: 0.75rem;
		font-size: 0.9375rem;
		white-space: nowrap;
		text-align: right;
		cursor: pointer;
	}
	nav [aria-current] {
		text-decoration: underline;
		text-underline-offset: 0.3em;
	}
	.language,
	.reset {
		position: absolute;
		bottom: 0;
		height: 3rem;
		padding: 0 0.875rem;
		border-radius: 0.75rem;
		color: var(--foreground);
		font-size: 0.8125rem;
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 100ms ease-out,
			visibility 180ms;
	}
	.language {
		left: 0.75rem;
	}
	.reset {
		right: 3rem;
		padding: 0 0.25rem;
	}
	.reset:disabled {
		color: var(--muted-foreground);
		cursor: default;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 1px solid currentColor;
		outline-offset: -4px;
	}
	@media (min-width: 48rem) {
		.mobile-nav {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mobile-nav,
		.open .filters.shown,
		.with-filters:not(.open) .filter-label,
		.filters,
		.filter-label,
		nav,
		.language,
		.reset,
		.hamburger span {
			transition: none;
		}
	}
</style>
