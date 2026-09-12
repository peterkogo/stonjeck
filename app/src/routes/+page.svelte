<script lang="ts">
	import WorksGrid from '$lib/works/WorksGrid.svelte';
	import { getWorks } from '$lib/data.remote';
</script>

<svelte:head>
	<title>Karim Stonjeck - Art Portfolio</title>
	<meta name="description" content="Discover the artwork collection of Karim Stonjeck" />
</svelte:head>

<WorksGrid works={await getWorks()} />
