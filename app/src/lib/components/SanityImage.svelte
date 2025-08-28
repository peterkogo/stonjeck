<script lang="ts">
	import { urlFor } from '$lib/sanity/client';
	import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
	import { decode } from 'blurhash';
	import { fade } from 'svelte/transition';

	let {
		image,
		alt,
		class: className,
		width = 800,
		height,
		fit = 'max'
	}: {
		image: SanityImageSource;
		alt: string;
		class?: string;
		width?: number;
		height?: number;
		fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale';
	} = $props();

	// Check if we're dealing with a forced aspect ratio (like aspect-square)
	const isSquareForced = className?.includes('aspect-square');

	let imageLoaded = $state(false);
	let blurHashCanvas = $state<HTMLCanvasElement | undefined>(undefined);
	let imageRef: HTMLImageElement;

	let dimensions = $derived((image as any)?.asset?.metadata?.dimensions);
	let aspectRatio = $derived(dimensions?.aspectRatio);

	// Create URL builder with hotspot support
	function createImageUrl(w: number, h?: number) {
		let builder = urlFor(image).width(w).auto('format').fit(fit);
		if (h) {
			builder = builder.height(h);
		}
		return builder.url();
	}

	function renderBlurHash() {
		const blurHash = (image as any)?.asset?.metadata?.blurHash;
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

<div class="relative">
	<img
		{alt}
		class={[className, '']}
		loading="lazy"
		bind:this={imageRef}
		width="{dimensions.width}px"
		height="{dimensions.height}px"
		src={createImageUrl(width, height)}
		srcSet={[
			`${createImageUrl(400, height ? Math.round((height * 400) / width) : undefined)} 400w`,
			`${createImageUrl(800, height ? Math.round((height * 800) / width) : undefined)} 800w`,
			`${createImageUrl(1200, height ? Math.round((height * 1200) / width) : undefined)} 1200w`
		].join(', ')}
		sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
		{onload}
	/>
	{#if !imageLoaded}
		<div class="absolute left-0 top-0 h-full w-full items-center justify-center">
			<canvas
				out:fade={{ duration: 500 }}
				bind:this={blurHashCanvas}
				width="32"
				height="32"
				style:aspect-ratio={isSquareForced ? '1' : aspectRatio}
				style:width={isSquareForced || aspectRatio > 1 ? '100%' : 'auto'}
				style:height={isSquareForced || aspectRatio > 1 ? 'auto' : '100%'}
				class="absolute inset-0 m-auto object-cover"
			></canvas>
		</div>
	{/if}
</div>
