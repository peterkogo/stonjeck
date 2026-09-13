# Portfolio frontend

SvelteKit and Svelte 5, styled with Tailwind CSS. Sanity provides the content;
Paraglide handles German and English locales.

## Configuration

Create `app/.env`:

```dotenv
PUBLIC_SANITY_PROJECT_ID=gc428fyp
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-06-15
```

The current client reads public published content without a token. The API version
above is also the client's fallback when the configured value is empty.

From the repository root:

```sh
pnpm --filter app dev
pnpm --filter app check
pnpm --filter app lint
pnpm --filter app build
pnpm --filter app preview
```

## Structure

- `src/lib/data.remote.ts`: GROQ queries and prerendered remote functions.
- `src/lib/sanity/client.ts`: Sanity client and image URL builder.
- `src/sanity.types.ts`: generated schema and query types; regenerate with `pnpm typegen`.
- `src/routes/+page.svelte`: featured news/exhibitions and the works overview.
- `src/routes/works/[[slug]]/+page.svelte`: works gallery, optionally opened at a specific work.
- `src/routes/about/+page.svelte`: artist biography and image.
- `project.inlang/`: locale configuration; Vite generates `src/lib/paraglide/`.

The root layout enables prerendering. Content is fetched during the build, and
SvelteKit discovers work pages through links in the overview. The Netlify adapter
writes the published site to `build/` and its supporting output to `.netlify/`.
Builds require access to Sanity, and published content changes require a new build.

## Layout and navigation details

`WorksGrid.svelte` deliberately uses CSS grid row spans calculated from image
metadata, with absolutely positioned images and CSS spacing. This keeps the layout
server-renderable without JavaScript measurements. Preserve this layout and its
browser fallback behavior when changing the grid.

`WorksViewer.svelte` initially renders only the requested work, then expands the
gallery after navigation and compensates the scroll position synchronously. Its
scroll readiness guard, history restoration, URL replacements and keyboard target
tracking work together with the scroll snapping in `src/app.html`.

Tag filters are stored in the `filter` query parameter. The prerendered overview
contains all works; filtering is applied in the browser. `tag-index.test.ts` covers
filter availability and matching.
