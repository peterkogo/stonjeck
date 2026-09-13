<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let {
		underline,
		textClass,
		class: classes,
		...rest
	}: { underline?: boolean; textClass?: ClassValue } & SvelteHTMLElements['h1'] = $props();
</script>

<h1 class={['cursor-help select-none', classes]} aria-label="Karim Stonjeck" {...rest}>
	<svg
		class="block w-full"
		viewBox="0 0 1000 200"
		preserveAspectRatio="xMidYMid meet"
		aria-hidden="true"
		focusable="false"
		style:view-transition-name="karimstonjeck"
	>
		<text
			x="0"
			y="132"
			fill="currentColor"
			font-size="155"
			font-weight="500"
			lengthAdjust="spacing"
			text-decoration={underline ? 'underline' : undefined}
			class={textClass}
		>
			Karim Stonjeck
		</text>
	</svg>
</h1>
