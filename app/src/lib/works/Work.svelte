<script lang="ts">
	import type { WorksQueryResult } from '../../sanity.types';
	import { pick } from '$lib/lang';
	import SanityImage from '../components/SanityImage.svelte';

	let { work, transition }: { work: WorksQueryResult[number]; transition?: boolean } =
		$props();
</script>

<SanityImage
	image={work.image}
	alt={pick(work.title, 'en') || pick(work.title, 'de') || 'Untitled'}
	width={500}
	quality={50}
	fit="crop"
	viewTransitionName={transition ? `work-${work._id}` : undefined}
	displayBlurHash={false}
/>
