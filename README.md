# Karim Stonjeck website

Artist portfolio with a SvelteKit frontend in `app/` and a Sanity CMS in `studio/`.
The workspace uses pnpm and Turborepo.

## Setup

Use Node.js 22 or newer and the pnpm version declared in `package.json`.

```sh
pnpm install
```

Create `app/.env` with the public Sanity settings described in [app/README.md](app/README.md).

## Commands

Run these from the repository root:

- `pnpm dev`: start the website and Sanity Studio.
- `pnpm build`: build both applications; the website fetches Sanity content while prerendering.
- `pnpm lint`: check formatting and ESLint in both applications.
- `pnpm check-types`: check Svelte/TypeScript in the website and TypeScript in the studio.
- `pnpm format`: format both applications using their own Prettier configuration.
- `pnpm typegen`: regenerate the frontend's Sanity query types from `studio/schema.json`.

After changing Sanity schemas, run `pnpm --filter stonjeck-studio extract` before
`pnpm typegen`. Generated query types live in `app/src/sanity.types.ts`.

See [app/README.md](app/README.md) for frontend architecture and
[studio/README.md](studio/README.md) for the CMS.
