<script lang="ts">
	import SanityImage from 'svelte-sanity-image';
	import { sanityClient } from '$lib/sanity/client';
	import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

	interface Props {
		image: SanityImageSource;
		alt: string;
		class?: string;
		sizes?: string;
		width?: number;
		height?: number;
		quality?: number;
		loading?: 'lazy' | 'eager';
	}

	let {
		image,
		alt,
		class: className = '',
		sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
		width,
		height,
		quality = 80,
		loading = 'lazy'
	}: Props = $props();
</script>

<SanityImage
	client={sanityClient}
	{image}
	{alt}
	class={className}
	{sizes}
	{width}
	{height}
	{quality}
	{loading}
/>
