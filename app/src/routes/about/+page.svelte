<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut as easing } from 'svelte/easing';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import KarimStonjeck from '$lib/components/KarimStonjeck.svelte';
	import { multilang } from '$lib/lang';

	let { data } = $props();
	let information = $derived(data.information);

	const biography = $derived(
		information.biography?.map((entry) => ({
			...entry,
			value: (entry.value ?? '').replace(/\n/g, '<br>')
		}))
	);
</script>

<div
	class="text-brown flex h-screen w-full flex-col items-center justify-center pt-15 sm:p-15"
>
	<div class="flex w-full items-center justify-center max-sm:flex-col">
		<div
			class="relative w-58 pt-5 max-sm:my-10 max-sm:w-68"
			in:fade={{ delay: 200, easing, duration: 350 }}
		>
			{#if information.titleImage?.image}
				<SanityImage
					image={information.titleImage.image}
					alt="Most recent work of the artist"
				/>
			{/if}
		</div>
		<div class="flex w-86 flex-col px-8 max-sm:w-68 max-sm:items-center max-sm:p-4">
			<div class="mb-3 max-w-48 max-sm:max-w-68"><KarimStonjeck class="text-brown" /></div>
			<div class=" text-[0.8rem] leading-relaxed" in:fade={{ delay: 350, easing }}>
				<Lang text={biography} html />
			</div>
		</div>
	</div>
	<div class="mt-10 flex w-full max-w-142 max-sm:max-w-62">
		<h2 class="text-2xl"><Lang text={multilang('Ausstellungen', 'Exhibitions')} /></h2>
	</div>
</div>
