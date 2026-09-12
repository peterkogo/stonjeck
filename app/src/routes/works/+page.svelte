<script lang="ts">
	import { error, redirect } from '@sveltejs/kit';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { getWorks } from '$lib/data.remote';

	const works = await getWorks();
	const slug = works.find((work) => work.slug?.current)?.slug?.current;

	if (!slug) {
		error(404, 'No works found');
	}

	redirect(308, localizeHref(`/works/${slug}`));
</script>
