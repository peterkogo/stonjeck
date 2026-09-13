<script lang="ts">
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';

	const isAbout = $derived(page.route.id === '/about');
	let homeSection = $state<'news' | 'works'>('news');
	let visibleSections = $state<'news' | 'works' | 'both'>('news');
	const activeSection = $derived(
		page.route.id === '/' ? homeSection : page.route.id === '/works' ? 'works' : undefined
	);
	const indicatorSection = $derived(page.route.id === '/' ? visibleSections : activeSection);
	let resizeObserver: ResizeObserver | undefined;
	let navigationFrame: number | undefined;

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
		navigationFrame = requestAnimationFrame(updateSection);
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

<aside
	class="bg-background fixed inset-y-0 left-0 z-20 flex w-[--site-sidebar-width] flex-col overflow-y-auto px-2 py-5 sm:px-4 sm:py-8"
>
	<a
		class="inline-block text-xl leading-[1.3] font-medium tracking-[-0.035em] whitespace-nowrap focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current"
		href={resolve(localizeHref(resolve('/')) as '/')}>Karim Stonjeck</a
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
		<div class="section-links" data-active={indicatorSection}>
			<span class="section-track" aria-hidden="true"
				><span class="section-indicator"></span></span
			>
			<a
				class="nav-link"
				href={resolve(`${localizeHref(resolve('/'))}#news` as '/')}
				aria-current={activeSection === 'news' ? 'location' : undefined}
			>
				{getLocale() === 'de' ? 'Aktuelles' : 'News'}
			</a>
			<a
				class="nav-link"
				href={resolve(`${localizeHref(resolve('/'))}#works` as '/')}
				aria-current={activeSection === 'works' ? 'location' : undefined}
			>
				{getLocale() === 'de' ? 'Arbeiten' : 'Works'}
			</a>
		</div>
	</nav>
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
	.nav-link {
		display: block;
		padding: 0.5rem 0.75rem 0.5rem 0;
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

	.section-links {
		position: relative;
	}

	.section-track {
		position: absolute;
		inset: 0 0 0 auto;
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
