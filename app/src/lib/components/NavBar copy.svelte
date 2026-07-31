<script lang="ts">
	import { Separator } from './ui/separator';
</script>

{#snippet navItem(text: string, className?: string)}
	<div
		class="hover:bg-background/30 cursor-pointer rounded-2xl px-2 py-1 select-none {className}"
	>
		{text}
	</div>
{/snippet}

<header
	class="text-background stonjeck pointer-events-none fixed top-10 right-0 left-12 z-10 flex w-full rounded-2xl text-2xl font-light"
>
	<div
		class="navbar bg-background/30 border-background/40 pointer-events-auto flex rounded-3xl border p-1 backdrop-blur-sm backdrop-brightness-60 backdrop-saturate-200"
	>
		{@render navItem('Karim Stonjeck', 'stonjeck')}
		<div class="mx-2 my-1">
			<Separator orientation="vertical" class="bg-background/40" />
		</div>
		{@render navItem('about')}
		{@render navItem('exhibitions')}
		{@render navItem('filter')}
	</div>
</header>

<style>
	:global(:root):active-view-transition .navbar {
		opacity: 0;
		translate: 0 25px;
		transition: none;
	}

	.navbar {
		opacity: 1;
		transition:
			opacity 0.35s 0.4s ease-in-out,
			translate 0.35s 0.4s ease-in-out;
	}

	.stonjeck {
		font-family: Charter, Georgia, 'Roboto Serif', serif;
	}
</style>
