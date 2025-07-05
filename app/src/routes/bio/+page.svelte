<script lang="ts">
	import type { PageData } from './$types';
	import { m } from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();
</script>

<div class="max-w-4xl px-8 py-24">
	<div class="prose prose-lg leading-relaxed text-gray-700">
		{m[data.information._id]()}
	</div>
</div>
