<script lang="ts">
	import { Separator } from './ui/separator';

	const items = [
		{ label: 'about', icon: PersonSimpleIcon },
		{ label: 'seperator', icon: Separator },
		{ label: 'events', icon: CalendarDotsIcon },
		{ label: 'filter', icon: FunnelIcon }
	];
</script>

{#snippet navItem(text: string, className?: string)}
	<div
		class="hover:bg-background/30 cursor-pointer rounded-2xl px-2 py-1 select-none {className}"
	>
		{text}
	</div>
{/snippet}

<!-- <header
	class="text-background stonjeck pointer-events-none fixed left-2 z-10 flex h-full w-full items-center rounded-2xl text-2xl font-light"
>
	<div
		class="navbar bg-background/30 border-background/40 pointer-events-auto flex flex-col rounded-3xl border p-1 backdrop-blur-sm backdrop-brightness-60 backdrop-saturate-200"
	>
		{#each items as item (item.label)}
			{#if item.label === 'seperator'}
				<div class="mx-2 my-1">
					<Separator orientation="horizontal" class="bg-background/40" />
				</div>
			{:else}
				<div class="hover:bg-background/30 cursor-pointer rounded-2xl px-2 py-1 select-none">
					<item.icon class="size-6" />
					<span class="text-sm">{item.label}</span>
				</div>
			{/if}
		{/each}
	</div>
</header> -->

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
