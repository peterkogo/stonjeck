<script lang="ts">
	import { fade } from 'svelte/transition';
	import { decode } from 'blurhash';

	import { urlFor } from '$lib/sanity/client';
	import type { WorksQueryResult } from '../../sanity.types';
	import type { ClassValue } from 'svelte/elements';

	type SanityImageWithMetadata = WorksQueryResult[number]['image'];

	let {
		image,
		alt,
		class: className,
		imageClass,
		width = 800,
		height,
		fit = 'max',
		quality = 75,
		displayBlurHash = true,
		viewTransitionName
	}: {
		image: SanityImageWithMetadata;
		alt: string;
		class?: ClassValue;
		imageClass?: ClassValue;
		width?: number;
		height?: number;
		fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale';
		quality?: number;
		displayBlurHash?: boolean;
		viewTransitionName?: string;
	} = $props();

	// Check if we're dealing with a forced aspect ratio (like aspect-square)
	const isSquareForced = $derived(className?.includes('aspect-square'));

	let imageLoaded = $state(false);
	let blurHashCanvas = $state<HTMLCanvasElement | undefined>(undefined);
	let imageRef: HTMLImageElement;

	let dimensions = $derived(image.asset.metadata.dimensions);

	// Create URL builder with hotspot support
	function createImageUrl(w: number, h?: number) {
		let builder = urlFor(image).width(w).auto('format').fit(fit).quality(quality);
		if (h) {
			builder = builder.height(h);
		}
		return builder.url();
	}

	function scaledHeight(w: number) {
		return height ? Math.round((height * w) / width) : undefined;
	}

	function renderBlurHash() {
		const blurHash = image.asset.metadata.blurHash;
		if (imageRef.complete || !blurHash || !blurHashCanvas) return;

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
		imageLoaded = true;
	}

	$effect(() => {
		if (blurHashCanvas) {
			renderBlurHash();
		}
	});
</script>

<div
	class={['relative block w-fit max-w-full', className]}
	style:view-transition-name={viewTransitionName}
>
	<img
		{alt}
		class={['block h-auto max-w-full', imageClass]}
		loading="lazy"
		bind:this={imageRef}
		src={createImageUrl(width, height)}
		srcSet={[500, 1000, 1500]
			.map((w) => `${createImageUrl(w, scaledHeight(w))} ${w}w`)
			.join(', ')}
		sizes="(max-width: 500px) 100vw, (max-width: 1000px) 100vw, 1500px"
		{onload}
	/>
	{#if !imageLoaded}
		<!-- <div class="absolute top-0 left-0 h-full w-full items-center justify-center"> -->
		<canvas
			out:fade={{ duration: displayBlurHash ? 500 : 0 }}
			bind:this={blurHashCanvas}
			width="32"
			height="32"
			style:aspect-ratio={isSquareForced ? '1' : dimensions.aspectRatio}
			style:width={isSquareForced || dimensions.aspectRatio > 1 ? '100%' : 'auto'}
			style:height={isSquareForced || dimensions.aspectRatio > 1 ? 'auto' : '100%'}
			class="absolute inset-0 object-cover"
		></canvas>
		<!-- </div> -->
	{/if}
</div>
