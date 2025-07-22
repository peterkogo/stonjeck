<script lang="ts">
	import type { PageData } from './$types';
	import { m } from '$lib/paraglide/messages';
	import SanityImage from '$lib/components/SanityImage.svelte';

	let { data }: { data: PageData } = $props();

	function formatText(text: string): string {
		return text.replace(/\n/g, '<br>');
	}
</script>

<div class="ml-8 mt-10 flex w-full items-center justify-center">
	<div class="relative w-48">
		<SanityImage
			image={data.information.titleImage.image}
			alt={'Most recent work of the artist'}
			class="max-h-72 min-h-0 min-w-0 object-contain"
		/>
	</div>

	<div class="max-w-4xl px-8 py-24">
		<div class="font-mono text-[0.8rem] leading-relaxed text-gray-700">
			{@html formatText(m[data.information._id]())}
		</div>
	</div>
</div>
