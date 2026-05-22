# UniMatch AI

UniMatch AI is a solo role-based sprint project for an AI-native university admission advisor. The repository is organized to show how one developer moves through four delivery phases without pretending there is a team:

1. Frontend Developer
2. Backend Developer
3. AI Engineer
4. QA Engineer & Workflow Master

The app lives in [`unimatch-ai`](./unimatch-ai). The root repository stores the workflow, AI role rules, and evidence artifacts used to prove the implementation.

## Current State

This repository currently contains a Next.js starter app and planning artifacts. Application features are intentionally not implemented in this documentation pass.

Existing scaffold:

- `unimatch-ai/`: Next.js App Router app with TypeScript and Tailwind CSS
- `ai-rules/`: role-specific AI execution rules
- `docs/evidence/`: placeholders for implementation evidence
- `README.md`: product and implementation plan
- `WORKFLOW.md`: solo role-based sprint workflow

## Target Product

UniMatch AI helps a prospective student compare university programs and receive structured admission guidance. The target experience is a working advisor interface that can:

- collect a student profile, academic scores, interests, budget, location preferences, and target degree level
- show a ranked list of matching universities and programs
- explain fit, risks, missing requirements, and next steps
- answer admission questions through an AI advisor that uses tools against known data
- keep working without Supabase by reading local seed data
- keep working without an OpenAI API key by returning a safe fallback advisor response

## Target Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Supabase-ready data access with local seed-data fallback
- OpenAI tool-calling style AI advisor
- Playwright tests
- Vercel deployment

## Planned App Structure

The implementation should stay inside `unimatch-ai/` unless a root workflow artifact is being updated.

Planned structure:

```text
unimatch-ai/
  src/
    app/
      page.tsx
      api/
        health/route.ts
        programs/route.ts
        recommendations/route.ts
        advisor/route.ts
    components/
      ui/
      advisor/
      admissions/
    lib/
      ai/
      data/
      supabase/
      validation/
    data/
      seed-universities.ts
  tests/
    e2e/
```

The exact file layout may change if the implementation reveals a simpler local pattern, but the separation between UI, API, data access, AI tools, and tests should remain clear.

## Core Data Model

Minimum entities:

- `University`: id, name, country, city, website, ranking notes, tuition range
- `Program`: id, university id, name, degree level, field, language, duration, tuition, deadline
- `AdmissionRequirement`: program id, GPA/test score requirements, documents, language requirements
- `StudentProfile`: intended field, degree level, GPA, tests, budget, location preferences, language, constraints
- `Recommendation`: program, match score, fit reasons, risks, missing requirements, suggested actions

All data access must support two modes:

- Supabase mode when configured environment variables are present
- local seed-data mode when Supabase is absent or unavailable

## Backend API Plan

Planned API routes:

- `GET /api/health`: returns app status, data source mode, and AI availability without exposing secrets
- `GET /api/programs`: returns filterable local or Supabase-backed programs
- `POST /api/recommendations`: accepts a validated student profile and returns ranked program matches
- `POST /api/advisor`: accepts advisor messages and profile context, executes AI tools when available, and returns a structured advisor response

All API responses should use stable JSON contracts with explicit error messages. API routes must not require Supabase or OpenAI to be present for the app to render.

## AI Advisor Plan

The advisor must use tools rather than behaving as plain chat only. Planned tools:

- `searchPrograms`: filter programs by field, location, degree level, language, and budget
- `rankPrograms`: score programs against a student profile
- `getProgramRequirements`: retrieve admission requirements for selected programs
- `explainRecommendation`: produce fit reasons, risks, and next steps from tool results

If `OPENAI_API_KEY` is missing, `/api/advisor` should return a safe fallback response that explains AI guidance is unavailable and still provides deterministic recommendations from seed data when possible.

## Environment Variables

No hardcoded secrets are allowed.

Optional variables:

```text
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- `.env.local` stays uncommitted.
- Public variables must contain only values safe for the browser.
- `SUPABASE_SERVICE_ROLE_KEY` must be used only in server-side code if it is ever needed.
- Missing variables must trigger fallback behavior, not a broken app.

## Solo Role Phases

### 1. Frontend Developer

Goal: create the admission advisor user experience.

Expected outputs:

- responsive App Router page
- student profile form
- recommendation results area
- advisor interaction panel
- loading, empty, error, and fallback states
- shadcn-style component primitives where useful

### 2. Backend Developer

Goal: create stable API contracts and data access.

Expected outputs:

- health, programs, recommendations, and advisor API routes
- TypeScript domain types and validation
- local seed-data fallback
- Supabase-ready repository layer
- clear error handling without leaking secrets

### 3. AI Engineer

Goal: implement an AI advisor that uses tools.

Expected outputs:

- advisor orchestration layer
- tool definitions and schemas
- deterministic fallback when AI is unavailable
- prompt and tool-result safety constraints
- structured advisor response contract

### 4. QA Engineer & Workflow Master

Goal: verify behavior, preserve evidence, and prepare deployment.

Expected outputs:

- Playwright tests for core flows
- API contract checks
- lint/build verification
- evidence files under `docs/evidence/`
- Vercel deployment notes
- final implementation checklist

## MCP Usage Plan

Use MCP and connected tools only for real project work, not to imply a multi-person team.

- Context7 MCP: fetch current documentation for Next.js, React, Tailwind CSS, Supabase, OpenAI SDK/tool calling, Playwright, and any shadcn-related setup before implementing or debugging library-specific code.
- Browser plugin: inspect local UI after frontend implementation and capture behavior issues before final QA.
- Supabase tools, if connected: inspect schema, logs, and advisors before applying any remote changes. Prefer local fallback first.
- GitHub tools, if connected and requested: inspect PR or CI status. Do not invent collaborators, reviewers, or participants.
- Web search: use only when current non-library information is required and MCP/local context is insufficient.

## Commit Plan

Recommended small commits:

1. `docs: define solo role-based sprint workflow`
2. `feat: build admission advisor frontend shell`
3. `feat: add program data and backend API routes`
4. `feat: add tool-based AI advisor with safe fallback`
5. `test: add playwright coverage and evidence placeholders`
6. `docs: finalize deployment and verification notes`

Each commit should map to one role phase or one clear cross-role handoff. Do not add fake author names, fake teammates, or fake approvals.

## Output Contracts

Frontend contract:

- renders without environment variables
- supports desktop and mobile layouts
- exposes form, results, and advisor states
- handles API errors and missing AI key gracefully

Backend contract:

- returns JSON with stable `ok`, `data`, and `error` fields or an equivalent documented shape
- validates incoming profile and advisor payloads
- reports data source mode as `supabase` or `seed`
- does not expose secrets in responses or logs

AI contract:

- calls tools for university/program facts and recommendation logic
- returns answer text plus supporting recommendations
- names uncertainty and missing data
- falls back safely when `OPENAI_API_KEY` is missing

QA contract:

- Playwright covers first-load, recommendation flow, advisor fallback, and basic responsive behavior
- build/lint/test results are recorded in `docs/evidence/`
- deployment evidence is documented without exposing project secrets

## Development Checklist

- [ ] Replace starter UI with UniMatch AI interface
- [ ] Add domain types and validation
- [ ] Add local seed university/program data
- [ ] Add Supabase-ready data repository with seed fallback
- [ ] Add backend API routes
- [ ] Add tool-based advisor orchestration
- [ ] Add missing-key AI fallback response
- [ ] Add Playwright tests
- [ ] Run lint, build, and tests
- [ ] Capture evidence in `docs/evidence/`
- [ ] Deploy to Vercel or document deployment blocker

## Local Commands

From `unimatch-ai/`:

```bash
npm run dev
npm run lint
npm run build
```

Playwright commands should be added when Playwright is installed.
