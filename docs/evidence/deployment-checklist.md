# Deployment Checklist

Date: 2026-05-24

Deployment was not executed from this environment. This checklist records the expected deployment path for the current implementation.

## Vercel Settings

- Framework: Next.js
- Project root directory: `unimatch-ai`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: use the Vercel default for Next.js

## Environment Variables

Optional server-side variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional browser-safe Supabase variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit `.env.local`. Do not place service-role or OpenAI keys in public variables.

## Pre-Deploy Checks

- `npm run lint`
- `npm run build`
- `npm run test:e2e`

## Post-Deploy Checks

- Open the deployed homepage and verify the UniMatch AI brand and Find my match CTA.
- Confirm `/api/health` returns `ok: true` without exposing secrets.
- Submit the admission fit profile and confirm ranked recommendations appear.
- Ask the advisor a simple question and confirm a student-facing answer appears.
- Verify public UI does not mention internal tooling, API route names, missing keys, or fallback/provider errors.

## Current Status

- Local lint/build/E2E verification passed.
- Deployment URL is pending.
