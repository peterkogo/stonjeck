<script lang="ts">
	import { urlFor } from '$lib/sanity/client';
	import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
	import { decode } from 'blurhash';
	import { fade } from 'svelte/transition';

	let {
		image,
		alt,
		class: className
	}: {
		image: SanityImageSource;
		alt: string;
		class?: string;
	} = $props();

	// console.log(image);
	let imageLoaded = $state(false);
	// svelte-ignore non_reactive_update
	let blurHashCanvas: HTMLCanvasElement;
	let imageRef: HTMLImageElement;

	let dimensions = $derived(image?.asset?.metadata?.dimensions);
	let aspectRatio = $derived(dimensions?.aspectRatio);

	let begin = performance.now();
	let canvasRendered = performance.now();

	function renderBlurHash() {
		const blurHash = image?.asset?.metadata?.blurHash;
		if (imageRef.complete || !blurHash || !blurHashCanvas) return;

		const canvas = blurHashCanvas;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Decode the blurhash with a reasonable size
		const blurWidth = 32;
		const blurHeight = 32;

		try {
			const pixels = decode(blurHash, blurWidth, blurHeight);
			const imageData = ctx.createImageData(blurWidth, blurHeight);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);
			canvasRendered = performance.now();
			// console.log('blurhash rendered');
		} catch (error) {
			console.warn('Failed to decode blurhash:', error);
		}
	}

	function onload() {
		console.log('image loaded', performance.now() - begin);
		console.log('canvas rendered', performance.now() - canvasRendered);
		imageLoaded = true;
	}

	// Re-render blurhash when it changes using $effect
	$effect(() => {
		if (!imageLoaded && blurHashCanvas) {
			renderBlurHash();
		}
	});
</script>

<div class="relative">
	<img
		{alt}
		class={className}
		loading="lazy"
		bind:this={imageRef}
		width={dimensions.width}
		height={dimensions.height}
		src={urlFor(image).width(800).url()}
		srcSet={[
			`${urlFor(image).auto('format').width(400).url()} 400w`,
			`${urlFor(image).auto('format').width(800).url()} 800w`,
			`${urlFor(image).auto('format').width(1200).url()} 1200w`
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
				style:aspect-ratio={aspectRatio}
				style:width={aspectRatio > 1 ? '100%' : 'auto'}
				style:height={aspectRatio > 1 ? 'auto' : '100%'}
				class="absolute inset-0 m-auto object-cover"
			></canvas>
		</div>
	{/if}
</div>
