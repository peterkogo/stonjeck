<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut as easing } from 'svelte/easing';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import KarimStonjeck from '$lib/components/KarimStonjeck.svelte';
	import { multilang } from '$lib/lang';
	import { getInformation } from '$lib/data.remote';

	const information = await getInformation();

	const biography = $derived(
		information.biography?.map((entry) => ({
			...entry,
			value: (entry.value ?? '').replace(/\n/g, '<br>')
		}))
	);
</script>

<div
	class="text-brown flex min-h-dvh w-full flex-col items-center justify-center px-5 py-12 lg:p-15"
>
	<div class="flex w-full items-center justify-center max-lg:flex-col">
		<div
			class="relative w-full max-w-58 shrink-0 max-lg:mb-8"
			style:aspect-ratio={information.titleImage?.image?.asset?.metadata?.dimensions
				?.aspectRatio ?? 0.8}
			in:fade={{ delay: 200, easing, duration: 350 }}
		>
			{#if information.titleImage?.image}
				<SanityImage
					image={information.titleImage.image}
					alt="Most recent work of the artist"
				/>
			{/if}
		</div>
		<div class="flex w-full max-w-86 flex-col lg:px-8">
			<div class="mb-3 max-w-48 max-lg:max-w-68"><KarimStonjeck class="text-brown" /></div>
			<div class=" text-[0.8rem] leading-relaxed" in:fade={{ delay: 350, easing }}>
				<Lang text={biography} html />
			</div>
		</div>
	</div>
	<div class="mt-10 flex w-full max-w-142 max-lg:max-w-86">
		<h2 class="text-2xl"><Lang text={multilang('Ausstellungen', 'Exhibitions')} /></h2>
	</div>
</div>
