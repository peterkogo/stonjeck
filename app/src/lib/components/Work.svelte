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
	<a
		href="/works?work={work._id}"
		data-sveltekit-preload-code="eager"
		style:view-transition-name="work-image-{work._id}"
		class="block"
	>
		<SanityImage
			image={work.image}
			alt={getMessage(work._id)}
			class="aspect-square w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
			width={400}
			height={400}
			fit="crop"
		/>
	</a>
{/if}
