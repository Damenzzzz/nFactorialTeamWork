# UniMatch AI

UniMatch AI is an AI-powered university admission platform that helps students search universities and programs, filter options by academic and financial constraints, calculate admission fit, compare shortlisted programs, and get AI-assisted admission guidance. The product also includes AI-powered profile parsing, smart search, program fit explanations, comparison summaries, and admission roadmaps grounded in the local program catalog.

## Live Demo

Live Demo: TODO - add Vercel link after deployment

## Repository Structure

- `unimatch-ai/` - Next.js application with the student-facing UI, API routes, local catalog data, AI advisor layer, and Playwright tests.
- `ai-rules/` - role-specific AI assistant rules used during the solo development workflow.
- `docs/subagents/` - Codex subagent instruction files for frontend, backend, AI advisor, and QA workflow phases.
- `docs/evidence/` - workflow, testing, and deployment evidence checklists and results.
- `WORKFLOW.md` - final process documentation for the solo role-based workflow.
- `AGENTS.md` - repository-level Codex operating guidance.

## Features

- Premium student-facing admissions interface with responsive dark SaaS styling.
- University and program catalog backed by curated local seed data.
- Catalog filters for country, field, degree level, tuition, IELTS score, and scholarship availability.
- Student admission profile form for intended field, degree level, GPA, IELTS, SAT, budget, preferred countries, and scholarship preference.
- Admission fit recommendation flow with ranked matches, match scores, fit reasons, risks, missing requirements, and next steps.
- Compare/shortlist workflow for up to three programs.
- AI advisor panel for catalog-grounded admission questions.
- AI profile parser that can fill profile fields from a pasted study goal.
- AI smart search that converts natural-language search into catalog filters.
- AI program fit explanation on program cards.
- AI comparison brief for shortlisted programs.
- AI admission roadmap after recommendation results.
- Local catalog fallback behavior when external services are not configured.
- OpenAI integration when `OPENAI_API_KEY` is configured.
- Playwright E2E tests for the main student workflow.

## AI-Native Features

UniMatch AI is not plain chat layered on top of a static page. The advisor architecture is tool-based and grounded in the known catalog.

Implemented advisor/API routes:

- `POST /api/advisor` - conversational advisor response using profile and shortlist context.
- `GET /api/advisor/status` - non-secret AI status and tool list.
- `POST /api/ai/profile-parser` - extracts a student profile from a study-goal sentence.
- `POST /api/ai/smart-search` - converts natural language into catalog filters.
- `POST /api/ai/program-insight` - explains fit for one catalog program.
- `POST /api/ai/compare-summary` - summarizes shortlisted program tradeoffs.
- `POST /api/ai/admission-roadmap` - generates an application roadmap from recommendations.

Implemented internal advisor tools:

- `searchPrograms`
- `comparePrograms`
- `getProgramRequirements`
- `calculateAdmissionChance`
- `saveStudentPreferences`

When OpenAI is configured, the app uses the OpenAI SDK with tool/function-calling style logic and structured outputs. When `OPENAI_API_KEY` is missing or unavailable, the app still builds and runs using deterministic catalog-based behavior. The advisor is constrained to recommend only programs from the catalog and should not invent universities, requirements, deadlines, or admission guarantees.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Local seed-data repository
- Playwright E2E tests
- Vercel deployment target

## Environment Variables

Create `unimatch-ai/.env.local` for local-only secrets. Do not commit this file.

```text
OPENAI_API_KEY=
OPENAI_MODEL=
```

Optional Supabase config-status variables currently detected by the app:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Rules:

- Never use `NEXT_PUBLIC_OPENAI_API_KEY`.
- Keep OpenAI keys server-side only.
- Missing `OPENAI_API_KEY` should not break the app.
- The current implementation uses local catalog data by default; Supabase adapter behavior is not implemented beyond configuration-status detection.

## Local Setup

From the repository root:

```bash
cd unimatch-ai
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build / Lint / Tests

Actual scripts from `unimatch-ai/package.json`:

```bash
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:ui
```

Install the Playwright browser once before the first local E2E run:

```bash
npx playwright install chromium
```

## API Routes

- `GET /api/health` - returns service status, active data source, Supabase config status, AI availability, and timestamp.
- `GET /api/programs` - returns filterable catalog programs with university and requirement data.
- `POST /api/recommendations` - accepts a student profile and returns ranked admission matches.
- `POST /api/advisor` - accepts a question plus optional profile/shortlist context and returns a structured advisor answer.
- `GET /api/advisor/status` - returns `openaiConfigured`, selected model, and advisor tool names without exposing keys.
- `POST /api/ai/profile-parser` - extracts profile fields from free text.
- `POST /api/ai/smart-search` - converts a natural-language query into catalog filters.
- `POST /api/ai/program-insight` - returns fit summary, strengths, risks, missing requirements, and next steps for a program.
- `POST /api/ai/compare-summary` - returns best overall, safest option, best value, scholarship-friendly option, tradeoffs, and final advice.
- `POST /api/ai/admission-roadmap` - returns an overview, timeline, document checklist, score-improvement advice, and deadline advice.

## Deployment

Vercel deployment steps:

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `unimatch-ai`.
3. Use `npm install` as the install command.
4. Use `npm run build` as the build command.
5. Add `OPENAI_API_KEY` and `OPENAI_MODEL` in Vercel environment variables if OpenAI-powered behavior is desired.
6. Add optional Supabase public URL/anon variables only if needed for config-status checks or future adapter work.
7. Redeploy after adding or changing environment variables.
8. Keep `.env.local` out of git.

## Known Limitations

- Catalog data is curated local data, not official live university data.
- Admission guidance and requirements should always be verified on official university pages.
- OpenAI-enhanced behavior requires a valid `OPENAI_API_KEY`.
- The app has no real authentication, payment flow, admin panel, or user accounts.
- The current data repository is local-first; Supabase is detected for configuration status but no Supabase data adapter is connected.
- Playwright tests cover the main desktop Chromium flows; visual regression, mobile E2E, and cross-browser suites are not included yet.
- Live deployment URL is still TODO.
]
