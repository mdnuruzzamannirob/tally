# Tally Web

This directory is the independent Next.js frontend project for Tally. It owns
the App Router UI, RTK Query API client, in-memory access-token state, and PWA
assets. Deploy it independently to Vercel.

It intentionally has no workspace dependency on `../api`.

The API contract is versioned in the API repository at `contracts/openapi.json`.
Update and release that contract with any endpoint or envelope change before
updating this client.

## Local development

```sh
cp .env.example .env.local
pnpm install
pnpm dev
```

Available checks are `pnpm build`, `pnpm lint`, `pnpm typecheck`,
`pnpm test`, and `pnpm test:e2e`.
