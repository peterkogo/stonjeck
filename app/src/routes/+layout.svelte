<script lang="ts">
	import { type Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	// import { getLocale, setLocale } from '$lib/paraglide/runtime';

	import '../app.css';

	let { children }: { children: Snippet } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// function toggleLocale() {
	// 	setLocale(getLocale() === 'en' ? 'de' : 'en');
	// }
</script>

{@render children()}

<!-- <button
	type="button"
	class="absolute top-0 left-0 cursor-pointer text-left"
	onclick={toggleLocale}
	aria-label={isEnglish() ? 'Switch to German' : 'Switch to English'}
>
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as `/${string}`)}
			data-sveltekit-reload
			style:display={locale === getLocale() ? 'block' : 'none'}
		>
			>{locale === 'en' ? 'deutsch' : 'english'}
		</a>
	{/each}
</button> -->
