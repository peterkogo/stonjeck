<script lang="ts">
	import { fade } from 'svelte/transition';

	import { urlFor } from '$lib/sanity/client';
	import type { SanityImageCrop, SanityImageHotspot } from '../../sanity.types';
	import { onMount } from 'svelte';

	/** Minimal image shape shared by works / information queries. */
	type SanityImageWithMetadata = {
		hotspot?: SanityImageHotspot | null;
		crop?: SanityImageCrop | null;
		asset?: {
			_id: string;
			metadata?: {
				lqip?: string | null;
				dimensions?: {
					width?: number | null;
					height?: number | null;
					aspectRatio?: number | null;
				} | null;
			} | null;
		} | null;
	} | null;

	let {
		image,
		imageWidth = 1000,
		containerHeight,
		width,
		height,
		alt,
		quality = 50,
		viewTransitionName
	}: {
		image: SanityImageWithMetadata;
		containerHeight?: string;
		imageWidth?: number;
		width?: string;
		height?: string;
		alt: string;
		quality?: number;
		viewTransitionName?: string;
	} = $props();

	let loadedSrc = $state<string | undefined>(undefined);
	const imageSrc = $derived(createImageUrl(imageWidth));
	const lqip = $derived(image?.asset?.metadata?.lqip);
	let imageRef = $state<HTMLImageElement | undefined>(undefined);

	// Create URL builder with hotspot support
	function createImageUrl(w: number, h?: number) {
		if (!image) return '';
		let builder = urlFor(image).width(w).auto('format').fit('max').quality(quality);
		if (h) {
			builder = builder.height(h);
		}
		return builder.url();
	}

	function onload() {
		loadedSrc = imageSrc;
	}

	onMount(() => {
		if (imageRef?.complete && imageRef.naturalWidth > 0) {
			loadedSrc = imageSrc;
		}
	});
</script>

<div
	class="@container-size relative flex h-full w-full items-center justify-center"
	style:height={containerHeight}
>
	<div
		style:view-transition-name={viewTransitionName}
		style:width
		style:height
		class="relative h-full w-full"
	>
		<img
			{alt}
			style:width
			style:height
			class="absolute inset-0 m-auto"
			bind:this={imageRef}
			loading="lazy"
			src={imageSrc}
			{onload}
		/>
		{#if lqip && loadedSrc !== imageSrc}
			<img
				out:fade={{ duration: 500 }}
				src={lqip}
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 size-full object-cover"
			/>
		{/if}
	</div>
</div>
