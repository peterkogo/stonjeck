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
</script>

<svelte:head>
	<title>Karim Stonjeck - Art Portfolio</title>
	<meta name="description" content="Discover the artwork collection of Karim Stonjeck" />
</svelte:head>

{#if newsWorks.length > 0 || events.length > 0}
	<section
		id="news"
		aria-label={getLocale() === 'de' ? 'Aktuelles' : 'News'}
		class="mb-12 lg:mb-20"
	>
		<WorksGrid works={newsWorks} {events} featured />
	</section>
{:else}
	<div id="news"></div>
{/if}

<section id="works" aria-label={getLocale() === 'de' ? 'Arbeiten' : 'Works'}>
	<WorksGrid {works} />
</section>
