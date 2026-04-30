<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { ClassValue } from 'svelte/elements';

	const BTN = 56;
	/** Must match CSS transition duration below (close latch uses the same value). */
	const MORPH_DURATION_MS = 150;
	const MORPH_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

	type Props = {
		/** Panel body when expanded */
		children: Snippet;
		/** Optional face for the closed circular control (default: plus icon) */
		trigger?: Snippet;
		expandedWidth?: number;
		expandedHeight?: number;
		/** Shown in the expanded header */
		panelTitle?: string;
		/** Prefix for element ids when multiple instances exist */
		surfaceId?: string;
		class?: ClassValue;
	};

	let {
		children,
		trigger,
		expandedWidth = 360,
		expandedHeight = 280,
		panelTitle = 'Panel',
		surfaceId = 'morph-floating-surface',
		class: className
	}: Props = $props();

	const titleId = $derived(`${surfaceId}-title`);

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);

	/** After `open` goes false, keep panel mounted until the CSS morph finishes. */
	let surfaceHeld = $state(false);

	const morphMs = $derived(prefersReducedMotion.current ? 0 : MORPH_DURATION_MS);

	const shellTransition = $derived(
		morphMs === 0
			? 'none'
			: `width ${morphMs}ms ${MORPH_EASING}, height ${morphMs}ms ${MORPH_EASING}, border-radius ${morphMs}ms ${MORPH_EASING}`
	);

	/** Keep panel mounted while open or while the close animation is still running. */
	const showSurface = $derived(open || surfaceHeld);

	$effect(() => {
		if (open) {
			surfaceHeld = true;
			return;
		}
		if (morphMs === 0) {
			surfaceHeld = false;
			return;
		}
		if (!surfaceHeld) return;
		const id = setTimeout(() => {
			surfaceHeld = false;
		}, morphMs);
		return () => clearTimeout(id);
	});

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	$effect(() => {
		if (!open || !rootEl) return;
		function onDoc(e: PointerEvent) {
			if (!rootEl?.contains(e.target as Node)) close();
		}
		document.addEventListener('pointerdown', onDoc, true);
		return () => document.removeEventListener('pointerdown', onDoc, true);
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			close();
		}
	}}
/>

<div
	class={[
		'pointer-events-none fixed right-6 bottom-6 z-50 flex items-end justify-end max-sm:right-4 max-sm:bottom-4',
		className
	]}
	aria-live="polite"
>
	<div
		bind:this={rootEl}
		class="pointer-events-auto relative overflow-hidden bg-neutral-200 text-neutral-900 shadow-lg ring-1 ring-black/5 will-change-[width,height] dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/10"
		style:width="{open ? expandedWidth : BTN}px"
		style:height="{open ? expandedHeight : BTN}px"
		style:border-radius={open ? '14px' : `${BTN / 2}px`}
		style:transition={shellTransition}
	>
		<!--
			Panel is fixed physical size and anchored to the bottom-right of this shell.
			The shell only changes width/height/radius (mask); content is never scaled down.
		-->
		{#if open || showSurface}
			<div
				class="absolute right-0 bottom-0 z-0 flex min-h-0 flex-col rounded-[14px] bg-neutral-200 p-1 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
				style:width="{expandedWidth}px"
				style:height="{expandedHeight}px"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-hidden={!open}
			>
				<div class="flex shrink-0 items-center justify-between gap-2 py-1 pr-1 pl-9">
					<span id={titleId} class="text-sm text-neutral-600 select-none dark:text-neutral-400"
						>{panelTitle}</span
					>
					<button
						type="button"
						class="rounded-lg px-2 py-1 text-sm text-neutral-600 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/10"
						onclick={close}
						aria-label="Close panel"
					>
						Close
					</button>
				</div>
				<div class="min-h-0 flex-1 overflow-auto px-3 pb-3">
					{@render children()}
				</div>
			</div>
		{/if}

		<!-- Accent dot: centered when closed, top-left when surface visible -->
		<div
			class="pointer-events-none absolute z-10 size-2 rounded-full bg-orange-500 ease-out"
			style:transition-duration={morphMs === 0 ? '0ms' : `${morphMs}ms`}
			style:transition-property="transform, top, left"
			style:transition-timing-function="ease-out"
			class:dot-open={showSurface}
			class:dot-closed={!showSurface}
			aria-hidden="true"
		></div>

		{#if !open && !showSurface}
			<button
				type="button"
				class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center rounded-full outline-offset-2 focus-visible:ring-2 focus-visible:ring-orange-500"
				onclick={toggle}
				aria-expanded="false"
				aria-haspopup="dialog"
				aria-label="Open panel"
			>
				{#if trigger}
					{@render trigger()}
				{:else}
					<svg
						class="size-6 text-neutral-700 dark:text-neutral-200"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							d="M12 5v14M5 12h14"
						/>
					</svg>
				{/if}
			</button>
		{/if}
	</div>
</div>

<style>
	.dot-closed {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 1;
	}
	.dot-open {
		top: 18px;
		left: 16px;
		transform: translate(0, 0);
		opacity: 1;
	}
</style>
