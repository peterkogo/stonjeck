<script lang="ts">
	import { fade } from 'svelte/transition';
	import { decode } from 'blurhash';

	import { urlFor } from '$lib/sanity/client';
	import type { WorksQueryResult } from '../../sanity.types';
	import type { ClassValue } from 'svelte/elements';
	import { onMount } from 'svelte';

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
		viewTransitionName,
		loading = 'lazy'
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
		loading?: 'eager' | 'lazy';
	} = $props();

	let imageLoaded = $state(false);
	let blurHashCanvas = $state<HTMLCanvasElement | undefined>(undefined);
	let imageRef: HTMLImageElement;

	let dimensions = $derived({
		width: 0,
		height: 0,
		aspectRatio: 0,
		...image?.asset?.metadata?.dimensions
	});

	let fitWidth = $derived(`min(100cqw, calc(100cqh * ${dimensions.aspectRatio}))`);
	let fitHeight = $derived(`min(100cqh, calc(100cqw / ${dimensions.aspectRatio}))`);

	// Create URL builder with hotspot support
	function createImageUrl(w: number, h?: number) {
		if (!image) return '';
		let builder = urlFor(image).width(w).auto('format').fit(fit).quality(quality);
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
		imageLoaded = true;
	}

	onMount(() => {
		if (blurHashCanvas && !imageLoaded) {
			renderBlurHash();
		}
	});

	// $inspect(imageLoaded, imageLoaded ? alt : '');
</script>

<div
	class="@container-size relative flex h-[calc(100dvh-var(--spacing)*32)] w-full items-center justify-center"
>
	<div
		style:view-transition-name={viewTransitionName}
		style:width={fitWidth}
		style:height={fitHeight}
		class="relative"
	>
		<img
			{alt}
			style:width={fitWidth}
			style:height={fitHeight}
			class="absolute inset-0 m-auto"
			{loading}
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
				class="absolute inset-0 size-full object-cover"
			></canvas>
		{/if}
	</div>
</div>
