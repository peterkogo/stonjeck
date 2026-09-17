<script lang="ts" module>
	// Remember successful loads for this session, including lazy images remounted
	// before the browser reports them as complete. This is not a cache inventory.
	// Load history is bookkeeping, not reactive UI state.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const loadedSources = new Set<string>();
</script>

<script lang="ts">
	import { urlFor } from '$lib/sanity/client';
	import type { SanityImageCrop, SanityImageHotspot } from '../../sanity.types';
	import { untrack } from 'svelte';
	import type { TransitionConfig } from 'svelte/transition';

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

	let animateReveal = false;

	function markLoaded(animate: boolean) {
		if (loadedSrc === imageSrc) return;
		animateReveal = animate;
		loadedSources.add(imageSrc);
		loadedSrc = imageSrc;
	}

	function onload() {
		markLoaded(!loadedSources.has(imageSrc));
	}

	$effect(() => {
		// Also covers hydration and src changes whose load event was already fired.
		const src = imageSrc;
		if (src && imageRef?.complete && imageRef.naturalWidth > 0) {
			untrack(() => markLoaded(false));
		}
	});

	const revealPlaceholder: (node: HTMLElement) => TransitionConfig = () => {
		// A placeholder has known opacity, so no computed-style/layout read is needed.
		// Only animate a fresh load, never removal during navigation or a cached reveal.
		return {
			duration: loadedSrc === imageSrc && animateReveal ? 500 : 0,
			css: (t: number) => `opacity: ${t}`
		};
	};
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
				out:revealPlaceholder
				src={lqip}
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 size-full object-cover"
			/>
		{/if}
	</div>
</div>
