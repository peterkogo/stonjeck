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
	let imageRef: HTMLImageElement;

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
		// if (image?.asset?._id === 'image-732008a9a1d10c0b5d8a90ef0260d32f0607940c-2755x3458-jpg') {
		// 	console.log(imageRef?.complete);
		// }
		if (blurHashCanvas && !imageRef?.complete) {
			renderBlurHash();
			mounted = true;
		}
	});

	// $effect(() => {
	// 	if (image?.asset?._id === 'image-732008a9a1d10c0b5d8a90ef0260d32f0607940c-2755x3458-jpg') {
	// 		// console.log({ onLoadFired, imageRef: !imageRef?.complete, mounted });
	// 		// console.log({
	// 		// 	shouldRenderBlurHash:
	// 		// 		(!onLoadFired && !imageRef?.complete) || (mounted && !onLoadFired)
	// 		// });
	// 	}
	// });
</script>

<div
	class="@container-size relative flex h-full w-full items-center justify-center"
	style:height={containerHeight}
>
	<div style:width style:height class="relative h-full w-full">
		<img
			{alt}
			style:width
			style:height
			style:view-transition-name={viewTransitionName}
			style:view-transition-class={viewTransitionName ? 'work' : undefined}
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

<!-- <div class="outer-div relative flex h-full w-full items-center justify-center">
	<div class="inner-div size-full" style:view-transition-name={viewTransitionName}>
		<img
			width="{width}px"
			height="{width / dimensions.aspectRatio}px"
			{alt}
			class={['size-full', imageClass]}
			loading="lazy"
			bind:this={imageRef}
			src={createImageUrl(width, height)}
			{onload}
		/>
		{#if (!onLoadFired && !imageRef?.complete) || (mounted && !onLoadFired)}
			<canvas
				class="absolute inset-0 size-full object-cover"
				out:fade={{ duration: displayBlurHash ? 2000 : 0 }}
				bind:this={blurHashCanvas}
				width="32"
				height="32"
				style:aspect-ratio={dimensions.aspectRatio}
				style:transform-origin="top left"
			></canvas>
		{/if}
	</div>
</div> -->

<!-- <div class={['relative flex w-fit max-w-full items-center justify-center', className]}>
	<div
		// class="h-fit w-fit"
		class="inner-div"
		style:view-transition-name={viewTransitionName}
		style:width="{width}px"
		style:height="{width / dimensions.aspectRatio}px"
	>
		<img
			width="{width}px"
			height="{width / dimensions.aspectRatio}px"
			{alt}
			class={['w-full', imageClass]}
			loading="lazy"
			bind:this={imageRef}
			src={createImageUrl(width, height)}
			{onload}
		/>
		{#if !imageLoaded}
			<canvas
				out:fade={{ duration: displayBlurHash ? 500 : 0 }}
				bind:this={blurHashCanvas}
				width="32"
				height="32"
				style:aspect-ratio={dimensions.aspectRatio}
				// style:width="auto"
				// style:height="100%"
				style:scale="4"
				style:transform-origin="top left"
				// style:width={dimensions.aspectRatio > 1 ? '100%' : 'auto'}
				// style:height={dimensions.aspectRatio > 1 ? 'auto' : '100%'}
				class="absolute inset-0 object-cover"
			></canvas>
		{/if}
	</div>
</div> -->
