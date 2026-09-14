<script lang="ts">
	import SanityImage from '$lib/components/SanityImage.svelte';
	import Lang from '$lib/components/Lang.svelte';
	import MobileTitle from '$lib/components/MobileTitle.svelte';
	import { getInformation } from '$lib/data.remote';
	import { getLocale } from '$lib/paraglide/runtime';
	import { pick } from '$lib/lang';

	const information = await getInformation();
	const biographyEntries = $derived(
		pick(information.biography, getLocale())
			.trim()
			.split(/\r?\n\s*\r?\n/)
			.filter(Boolean)
			.map((paragraph) => {
				const [firstLine, ...rest] = paragraph.split(/\r?\n/);
				const dated =
					/^(?:\d{4}|since\s+\d{4}|seit\s+\d{4})/i.test(firstLine) && rest.length > 0;
				return { date: dated ? firstLine : null, text: dated ? rest.join('\n') : paragraph };
			})
	);
</script>

<svelte:head>
	<title>{getLocale() === 'de' ? 'Über' : 'About'} — Karim Stonjeck</title>
</svelte:head>

<MobileTitle />

<div class="about">
	<article
		class="about-content"
		class:has-image={!!information.titleImage?.image}
		aria-label="Karim Stonjeck"
	>
		{#if information.titleImage?.image}
			<figure
				class="about-image"
				style:aspect-ratio={information.titleImage?.image?.asset?.metadata?.dimensions
					?.aspectRatio ?? 0.8}
			>
				<SanityImage
					image={information.titleImage.image}
					alt={getLocale() === 'de'
						? 'Kunstwerk von Karim Stonjeck'
						: 'Artwork by Karim Stonjeck'}
				/>
			</figure>
		{/if}
		<div class="about-copy">
			<h1 class="desktop-name">Karim Stonjeck</h1>
			<div class="biography">
				<Lang text={information.biography} />
			</div>
			<div class="mobile-biography">
				{#each biographyEntries as entry, index (index)}
					{#if entry.date}
						<dl class="biography-entry">
							<dt>{entry.date}</dt>
							<dd>{entry.text}</dd>
						</dl>
					{:else}
						<p class:introduction={index === 0}>{entry.text}</p>
					{/if}
				{/each}
			</div>
		</div>
	</article>
</div>

<style>
	.about {
		display: flex;
		justify-content: center;
		min-height: 100dvh;
		padding: 2.5rem max(1.375rem, env(safe-area-inset-right))
			calc(6rem + env(safe-area-inset-bottom)) max(1.375rem, env(safe-area-inset-left));
	}

	.about-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 21rem;
	}

	.about-image {
		position: relative;
		flex-shrink: 0;
		width: min(100%, 16rem);
		margin: 0;
	}

	.about-copy {
		min-width: 0;
	}

	h1 {
		margin: 0 0 1.25rem;
		font-size: 1.75rem;
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.035em;
	}

	.biography {
		font-size: 0.9375rem;
		line-height: 1.7;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.mobile-biography {
		display: none;
	}

	@media (max-width: 47.999rem) {
		.about {
			align-items: center;
			padding-top: calc(6rem + env(safe-area-inset-top));
		}

		.about-content {
			display: grid;
			grid-template-columns: min(7.5rem, 30vw) minmax(0, 1fr);
			align-content: start;
			gap: 2rem 1.25rem;
		}

		.about-image {
			grid-column: 1;
			grid-row: 1;
			width: 100%;
		}

		.about-copy {
			display: contents;
		}

		.desktop-name,
		.biography {
			display: none;
		}

		.mobile-biography {
			display: contents;
			font-size: 1rem;
			line-height: 1.65;
			white-space: pre-line;
			overflow-wrap: anywhere;
		}

		.mobile-biography p,
		.biography-entry,
		.biography-entry dd {
			margin: 0;
		}

		.mobile-biography p {
			grid-column: 1 / -1;
		}

		.has-image .introduction {
			grid-column: 2;
			grid-row: 1;
			align-self: center;
		}

		.biography-entry {
			grid-column: 1 / -1;
			display: grid;
			grid-template-columns: 5rem minmax(0, 1fr);
			gap: 1rem;
		}

		.biography-entry dt {
			padding-top: 0.125rem;
			color: var(--muted-foreground);
			font-size: 0.875rem;
			letter-spacing: 0.025em;
		}
	}

	@media (min-width: 48rem) {
		.about {
			align-items: center;
			padding: 3rem;
		}
	}

	@media (min-width: 64rem) {
		.about-content {
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 2.5rem;
			max-width: 38rem;
		}

		.about-image {
			width: 14.5rem;
		}

		.about-copy {
			flex: 1;
			max-width: 21rem;
		}

		.biography {
			font-size: 0.875rem;
		}
	}
</style>
