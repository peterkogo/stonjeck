<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import WorksGrid from '$lib/works/WorksGrid.svelte';
	import MobileTitle from '$lib/components/MobileTitle.svelte';
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

{#snippet sectionDivider(label: string)}
	<h2 class="section-divider">
		{label}
		<span aria-hidden="true"></span>
	</h2>
{/snippet}

<div class="home">
	<MobileTitle />
	<div class="home-sections">
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

		<section id="works" aria-label={getLocale() === 'de' ? 'Werke' : 'Works'}>
			{@render sectionDivider(getLocale() === 'de' ? 'Werke' : 'Works')}
			<WorksGrid {works} />
		</section>
	</div>
</div>

<style>
	.home {
		/* Equal space above and below the shared title, including the grid padding. */
		--section-top: calc(var(--mobile-title-top) * 2 + var(--mobile-title-height) - 1.25rem);
	}

	.home-sections {
		/* The grid supplies the final 1.25rem of space above its images. */
		padding-top: var(--section-top);
	}

	section {
		position: relative;
		/* Match the opening layout for both hash links and scrollIntoView. */
		scroll-margin-top: var(--section-top);
	}

	.section-divider {
		position: absolute;
		/* Halfway from the page top to the images, relative to this section. */
		top: calc((1.25rem - var(--section-top)) / 2);
		right: 0;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		margin: 0;
		color: var(--muted-foreground);
		font-size: clamp(0.6875rem, 2.8vw, 0.8125rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.06em;
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

	@media (max-width: 47.999rem) {
		#news {
			/* Keep the previous artwork above the viewport when Works is aligned. */
			margin-bottom: max(3rem, calc(var(--section-top) - 1.25rem));
		}
	}

	@media (min-width: 48rem) {
		section {
			scroll-margin-top: 0;
		}

		.home-sections {
			padding-top: 0;
		}

		.section-divider {
			display: none;
		}
	}
</style>
