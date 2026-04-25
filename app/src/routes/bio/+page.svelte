<script lang="ts">
	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import { getInformation } from '$lib/data.remote';

	const information = await getInformation();

	const biography = $derived(
		information.biography?.map((entry) => ({
			...entry,
			value: (entry.value ?? '').replace(/\n/g, '<br>')
		}))
	);
</script>

<div class="mt-10 ml-8 flex w-full items-center justify-center">
	<div class="relative w-48">
		{#if information.titleImage?.image}
			<SanityImage
				image={information.titleImage.image}
				alt="Most recent work of the artist"
				class="max-h-72 min-h-0 min-w-0 object-contain"
			/>
		{/if}
	</div>

	<div class="max-w-4xl px-8 py-24">
		<div class="font-mono text-[0.8rem] leading-relaxed text-gray-700">
			<Lang text={biography} html />
		</div>
	</div>
</div>
