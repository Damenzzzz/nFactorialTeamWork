# UniMatch AI App

Next.js App Router application for the UniMatch AI admissions platform.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run lint
npm run build
```

## E2E Tests

Install the Chromium browser once:

```bash
npx playwright install chromium
```

Run the production build and tests:

```bash
npm run build
npm run test:e2e
```

Interactive mode:

```bash
npm run test:e2e:ui
```

## Environment Variables

Optional local variables belong in `.env.local`, which must stay uncommitted.

```text
OPENAI_API_KEY=
OPENAI_MODEL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The app works without OpenAI or Supabase by using catalog-based local behavior.

## Deploy

For Vercel, set the project root to `unimatch-ai`, use `npm install`, and build with `npm run build`. Add optional environment variables in Vercel project settings instead of committing them.
