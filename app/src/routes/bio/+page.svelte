<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut as easing } from 'svelte/easing';

	import { getInformation } from '$lib/data.remote';

	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import KarimStonjeck from '$lib/components/KarimStonjeck.svelte';

	const information = await getInformation();

	const biography = $derived(
		information.biography?.map((entry) => ({
			...entry,
			value: (entry.value ?? '').replace(/\n/g, '<br>')
		}))
	);
</script>

<div class="flex h-screen w-full items-center justify-center p-15">
	<div class="flex w-full items-center max-sm:flex-col sm:justify-center">
		<div
			class="relative w-58 pt-5 max-sm:mb-10 max-sm:w-68"
			in:fade={{ delay: 200, easing, duration: 350 }}
		>
			{#if information.titleImage?.image}
				<SanityImage
					image={information.titleImage.image}
					alt="Most recent work of the artist"
				/>
			{/if}
		</div>
		<div class="max-w-84 px-8">
			<div class="mb-3 max-w-48 max-sm:max-w-68"><KarimStonjeck class="text-brown" /></div>
			<div class="text-brown text-[0.9rem] leading-relaxed" in:fade={{ delay: 350, easing }}>
				<Lang text={biography} html />
			</div>
		</div>
	</div>
</div>
