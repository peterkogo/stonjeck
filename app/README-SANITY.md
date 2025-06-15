# Sanity Integration for SvelteKit

This document explains how to set up and use the Sanity CMS integration with your SvelteKit application.

## Features

- ✅ **Server-Side Rendered (SSR)** - Content is fetched at build time
- ✅ **Static Route Generation** - All work and series pages are pre-rendered
- ✅ **Svelte 5 Compatible** - Uses the latest Svelte 5 syntax throughout
- ✅ **Client-Side Images** - Images are handled client-side using `svelte-sanity-image`
- ✅ **Internationalization Ready** - Support for multilingual content (EN/DE)
- ✅ **TypeScript** - Fully typed with proper Sanity schema types

## Environment Variables

Create a `.env` file in the `app` directory with the following variables:

```env
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID="your_project_id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-03-15"
SANITY_API_READ_TOKEN="your_read_token"
```

### Getting the Values

1. **Project ID**: Found in your Sanity Studio project settings
2. **Dataset**: Usually "production" or "development"
3. **API Version**: Use "2024-03-15" or the current date
4. **Read Token**: Create a read-only token in your Sanity project settings

## Architecture

### Client Configuration (`src/lib/sanity/client.ts`)

- Public client for image handling
- Server client factory for SSR with authentication

### Types (`src/lib/sanity/types.ts`)

- TypeScript interfaces for all Sanity schemas
- Helper functions for internationalized content

### Queries (`src/lib/sanity/queries.ts`)

- GROQ queries for fetching works and series
- Optimized queries with proper reference resolution

### Server API (`src/lib/server/sanity.ts`)

- Server-side functions for data fetching
- Error handling and fallbacks

## Routes Structure

```
/works                  # All works gallery
/works/[id]             # Individual work detail
/series                 # All series list
/series/[id]            # Individual series with works
```

### Static Generation

All dynamic routes (`/works/[id]` and `/series/[id]`) are pre-rendered at build time using the `entries()` function and `prerender = true`.

## Components

### SanityImage (`src/lib/components/SanityImage.svelte`)

- Wrapper around `svelte-sanity-image`
- Handles responsive images with proper optimization
- Client-side image loading as requested

## Internationalization

The system supports multilingual content through Sanity's internationalized fields:

```typescript
// Get localized content
const title = getLocalizedValue(work.title, 'en', 'de');
```

Currently defaults to English with German fallback. You can integrate this with `@inlang/paraglide-js` for dynamic language switching.

## Usage Examples

### Fetching Data in Load Functions

```typescript
// +page.server.ts
import { getAllWorks } from '$lib/server/sanity';

export const load: PageServerLoad = async () => {
	const works = await getAllWorks();
	return { works };
};
```

### Using Data in Components

```svelte
<script lang="ts">
	import { getLocalizedValue } from '$lib/sanity/types';
	import SanityImage from '$lib/components/SanityImage.svelte';

	let { data } = $props();
	const currentLanguage = 'en';
</script>

{#each data.works as work}
	<h2>{getLocalizedValue(work.title, currentLanguage)}</h2>
	<SanityImage
		image={work.image}
		alt={getLocalizedValue(work.title, currentLanguage)}
		width={400}
		height={400}
	/>
{/each}
```

## Build & Deployment

Since all routes are pre-rendered, the app generates static files for all content at build time:

```bash
npm run build
```

This will:

1. Fetch all content from Sanity
2. Generate static pages for each work and series
3. Optimize images for different screen sizes
4. Create a fully static site

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will fetch content from Sanity in real-time, but in production, everything is pre-built for optimal performance.

## Troubleshooting

### Missing Environment Variables

Make sure all required environment variables are set. The app will throw clear error messages for missing variables.

### Build Errors

- Check that your Sanity project has content
- Verify your read token has proper permissions
- Ensure the API version is compatible

### Image Loading Issues

- Verify your Sanity project ID is correct
- Check that images exist and are published in Sanity
- Ensure the `svelte-sanity-image` package is properly installed
