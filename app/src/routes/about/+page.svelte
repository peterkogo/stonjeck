<script lang="ts">
	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import KarimStonjeck from '$lib/components/KarimStonjeck.svelte';
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
			<div class=" text-[0.8rem] leading-relaxed">
				<Lang text={biography} html />
			</div>
		</div>
	</div>
</div>
