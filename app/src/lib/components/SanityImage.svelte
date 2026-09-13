<script lang="ts">
	import { fade } from 'svelte/transition';
	import { decode } from 'blurhash';

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
				blurHash?: string | null;
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

	let mounted = $state(false);
	let onLoadFired = $state(false);
	let blurHashCanvas = $state<HTMLCanvasElement | undefined>(undefined);
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

	function renderBlurHash() {
		const blurHash = image?.asset?.metadata?.blurHash;
		if (!blurHash || !blurHashCanvas) return;

		const canvas = blurHashCanvas;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const blurWidth = 32;
		const blurHeight = 32;

		try {
			const pixels = decode(blurHash, blurWidth, blurHeight);
			const imageData = ctx.createImageData(blurWidth, blurHeight);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);
		} catch (error) {
			console.warn('Failed to decode blurhash:', error);
		}
	}

	function onload() {
		onLoadFired = true;
	}

	onMount(() => {
		if (blurHashCanvas && !imageRef?.complete) {
			renderBlurHash();
			mounted = true;
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
			src={createImageUrl(imageWidth)}
			{onload}
		/>
		{#if (!onLoadFired && !imageRef?.complete) || (mounted && !onLoadFired)}
			<canvas
				out:fade={{ duration: 500 }}
				bind:this={blurHashCanvas}
				width="32"
				height="32"
				class="absolute inset-0 size-full object-cover"
			></canvas>
		{/if}
	</div>
</div>
