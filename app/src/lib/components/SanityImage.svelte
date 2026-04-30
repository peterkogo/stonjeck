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
		width = 1000,
		height,
		fit = 'max',
		quality = 50,
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
		width="{width}px"
		height="{width / dimensions.aspectRatio}px"
		//{alt}
		class={['block h-auto max-w-full', imageClass]}
		loading="lazy"
		bind:this={imageRef}
		src={createImageUrl(width, height)}
		{onload}
	/>
	<!-- {#if !imageLoaded}
		<canvas
			out:fade={{ duration: displayBlurHash ? 500 : 0 }}
			bind:this={blurHashCanvas}
			width="32"
			height="32"
			style:aspect-ratio={dimensions.aspectRatio}
			style:width={dimensions.aspectRatio > 1 ? '100%' : 'auto'}
			style:height={dimensions.aspectRatio > 1 ? 'auto' : '100%'}
			class="absolute inset-0 object-cover"
		></canvas>
	{/if} -->
</div>
