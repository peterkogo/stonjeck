# Sanity Studio

Content editing for the Karim Stonjeck portfolio. Project and dataset settings are
in `sanity.config.ts` and `sanity.cli.ts`; schemas are in `schemaTypes/`.

From the repository root:

```sh
pnpm --filter stonjeck-studio dev
pnpm --filter stonjeck-studio lint
pnpm --filter stonjeck-studio check-types
pnpm --filter stonjeck-studio build
```

After schema changes, refresh the schema snapshot and frontend types:

```sh
pnpm --filter stonjeck-studio extract
pnpm typegen
```

After changing only frontend GROQ queries, `pnpm typegen` is sufficient. TypeGen
writes `app/src/sanity.types.ts`; do not edit that generated file by hand.

The studio retains the series schema for CMS content even though the current
frontend has no series page.
