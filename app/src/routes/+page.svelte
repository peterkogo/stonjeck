<script lang="ts">
	import WorksGrid from '$lib/works/WorksGrid.svelte';

	let { data } = $props();
	let works = $derived(data.works);
</script>

<svelte:head>
	<title>Karim Stonjeck - Art Portfolio</title>
	<meta name="description" content="Discover the artwork collection of Karim Stonjeck" />
</svelte:head>

<WorksGrid {works} />
