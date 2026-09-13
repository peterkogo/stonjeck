<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';

	const isAbout = $derived(page.route.id === '/about');
</script>

<aside
	class="bg-background fixed inset-y-0 left-0 z-20 flex w-[--site-sidebar-width] flex-col overflow-y-auto px-2 py-5 sm:px-4 sm:py-8"
>
	<a
		class="inline-block text-xl leading-[1.3] font-medium tracking-[-0.035em] whitespace-nowrap focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current"
		href={localizeHref(resolve('/'))}>Karim Stonjeck</a
	>
	<nav
		class="mt-8 flex flex-col items-start gap-1 text-xs sm:mt-10 sm:text-[0.8125rem]"
		aria-label={getLocale() === 'de' ? 'Hauptnavigation' : 'Main navigation'}
	>
		<a
			class="text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground py-2 hover:underline hover:decoration-1 hover:underline-offset-[0.3em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[5px] focus-visible:outline-current aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[0.3em]"
			href={localizeHref(resolve('/'))}
			aria-current={!isAbout ? 'page' : undefined}
		>
			{getLocale() === 'de' ? 'Arbeiten' : 'Works'}
		</a>
		<a
			class="text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground py-2 hover:underline hover:decoration-1 hover:underline-offset-[0.3em] focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[0.3em]"
			href={localizeHref(resolve('/about'))}
			aria-current={isAbout ? 'page' : undefined}
		>
			{getLocale() === 'de' ? 'Über' : 'About'}
		</a>
	</nav>
	<div
		class="text-muted-foreground mt-auto flex items-center gap-1 pt-8 text-[0.6875rem] whitespace-nowrap sm:gap-[0.35rem] sm:text-[0.8125rem]"
	>
		<button
			class="hover:text-foreground cursor-pointer py-2 hover:underline hover:underline-offset-[0.3em] focus-visible:outline focus-visible:outline-offset-[5px] focus-visible:outline-current"
			type="button"
			onclick={() => setLocale(getLocale() === 'de' ? 'en' : 'de')}
		>
			{getLocale() === 'de' ? 'english' : 'deutsch'}
		</button>
	</div>
</aside>
