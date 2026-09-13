<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import WorksGrid from '$lib/works/WorksGrid.svelte';
	import { getNewsEvents, getNewsWorkIds, getWorks } from '$lib/data.remote';

	const [works, newsWorkIds, events] = await Promise.all([
		getWorks(),
		getNewsWorkIds(),
		getNewsEvents()
	]);
	const newsWorks = newsWorkIds.flatMap((id) => {
		const work = works.find((work) => work._id === id);
		return work ? [work] : [];
	});
	const hasNews = newsWorks.length > 0 || events.length > 0;
</script>

<svelte:head>
	<title>Karim Stonjeck - Art Portfolio</title>
	<meta name="description" content="Discover the artwork collection of Karim Stonjeck" />
</svelte:head>

<h1
	class="pointer-events-none fixed top-5 left-5 z-30 w-[calc((100%-2.5rem-15px)/2)] text-white mix-blend-difference md:hidden"
	aria-label="Karim Stonjeck"
>
	<svg class="block w-full" viewBox="0 0 1000 160" aria-hidden="true" focusable="false">
		<text
			x="0"
			y="120"
			fill="currentColor"
			font-size="155"
			font-weight="500"
			textLength="1000"
			lengthAdjust="spacingAndGlyphs"
		>
			Karim Stonjeck
		</text>
	</svg>
</h1>

{#snippet sectionDivider(label: string)}
	<h2 class="section-divider">
		{label}
		<span aria-hidden="true"></span>
	</h2>
{/snippet}

<!-- Keep the first grid close to the title, with its divider in the gap. -->
<div class="pt-[calc((100vw-2.5rem-15px)/2*0.16+5px)] md:pt-0">
	{#if hasNews}
		<section
			id="news"
			aria-label={getLocale() === 'de' ? 'Aktuelles' : 'News'}
			class="mb-12 lg:mb-20"
		>
			{@render sectionDivider(getLocale() === 'de' ? 'Aktuelles' : 'News')}
			<WorksGrid works={newsWorks} {events} featured />
		</section>
	{:else}
		<div id="news"></div>
	{/if}

	<section
		id="works"
		class:after-news={hasNews}
		aria-label={getLocale() === 'de' ? 'Arbeiten' : 'Works'}
	>
		{@render sectionDivider(getLocale() === 'de' ? 'Arbeiten' : 'Works')}
		<WorksGrid {works} />
	</section>
</div>

<style>
	section {
		position: relative;
	}

	.section-divider {
		position: absolute;
		top: 0.3125rem;
		right: 0;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		margin: 0;
		color: var(--muted-foreground);
		font-size: 1.0625rem;
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.06em;
	}

	section:not(.after-news) .section-divider {
		margin-top: -1rem;
	}

	/* Center in the existing 3rem section margin; both grids have equal padding. */
	.after-news .section-divider {
		top: -1.5rem;
	}

	.section-divider span {
		position: relative;
		width: 1.75rem;
		height: 1px;
		background: currentColor;
		opacity: 0.35;
	}

	.section-divider span::before {
		position: absolute;
		top: -2px;
		right: 0;
		width: 1px;
		height: 5px;
		background: currentColor;
		content: '';
	}

	@media (min-width: 48rem) {
		.section-divider {
			display: none;
		}
	}
</style>
