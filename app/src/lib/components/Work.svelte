<script lang="ts">
	import SanityImage from './SanityImage.svelte';
	import { m } from '$lib/paraglide/messages';

	type WorkData = {
		_id: string;
		date?: string | null;
		size?: string;
		image?: any;
		medium?: {
			_id: string;
			name?: string;
		} | null;
		slug?: {
			current: string;
		} | null;
	};

	let { work }: { work: WorkData } = $props();

	// Type-safe message access
	function getMessage(id: string): string {
		return (m as any)[id]?.() || 'Untitled';
	}
</script>

{#if work.image}
	<SanityImage
		image={work.image}
		alt={getMessage(work._id)}
		class="aspect-square w-full object-cover"
		width={400}
		height={400}
		fit="crop"
	/>
{/if}
