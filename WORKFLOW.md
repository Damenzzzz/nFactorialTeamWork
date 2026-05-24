# UniMatch AI Workflow

## Project Overview

UniMatch AI is an AI-native university admissions platform. The final product goal is to help students explore programs, calculate admission fit, compare shortlisted options, and receive catalog-grounded AI guidance for application planning.

The implemented app is in `unimatch-ai/` and includes a student-facing Next.js interface, local catalog data, backend API routes, recommendation logic, AI advisor/tools, AI-native workflow features, and Playwright E2E tests.

## Solo Role-Based Workflow

This project was completed solo. The work was organized into role phases to keep responsibilities clear:

- Frontend Developer
- Backend Developer
- AI Engineer
- QA Engineer & Workflow Master

These roles are workflow lenses for one developer using Codex. No fake teammates, reviewers, approvals, or team activity were created.

## Timeline / Commit-Based Progress

Available git history shows the project moving through these real phases:

- Project setup: initialized the Next.js app.
- Workflow setup: added architecture notes, role-based workflow plan, `AGENTS.md`, AI rules, and subagent docs.
- Backend/data/API: added local university/program data, recommendation logic, and core API routes.
- Frontend UI: converted the prototype into a premium student-facing admissions platform.
- AI advisor/tools: added a tool-based advisor route and catalog-grounded fallback behavior.
- UI corrections: improved advisor wording and fixed profile form layout issues.
- AI-native workflow: integrated profile parsing, smart search, program insights, compare summaries, and roadmaps into the main workflow.
- QA/docs/deployment preparation: added Playwright E2E coverage and evidence/deployment documentation.

Representative commits in the current history include:

- `chore: initialize Next.js project`
- `docs: add architecture and role-based workflow plan`
- `docs: add Codex agents and subagent instructions`
- `feat(backend): add program data and recommendation APIs`
- `feat(frontend): turn prototype into student-facing platform`
- `feat(ai): add advisor route with tool-based recommendations`
- `fix(ui): polish advisor wording and profile form layout`
- `feat(ai): integrate AI across admission workflow`
- `test(e2e): add Playwright coverage for core flows`

## Role 1 - Frontend Developer

Frontend work delivered the student-facing product experience:

- Premium dark SaaS-style interface.
- Hero and navigation focused on the actual admissions workflow.
- University/program catalog with cards and filters.
- Student admission profile form.
- Recommendation result UI with scores, risks, missing requirements, and next steps.
- Compare/shortlist section.
- Advisor panel and AI feature surfaces integrated into the main workflow.
- Responsive layout patterns for desktop and mobile.
- Public UI copy cleanup so internal workflow evidence, tool names, missing-key messages, MCP, Codex, Playwright, and API route details are not exposed to students.

UI issues corrected during the process included overly technical advisor fallback wording and an awkward degree-level segmented control layout.

## Role 2 - Backend Developer

Backend work delivered typed data and stable APIs:

- TypeScript domain model for universities, programs, requirements, student profiles, recommendations, advisor responses, and AI feature payloads.
- Curated local seed-data repository.
- Program filtering by country, countries, field, degree level, tuition, IELTS, and scholarship availability.
- Recommendation scoring and ranking logic.
- Stable JSON API response contracts using `ok`, `data`, and `error`.
- API routes for health, programs, recommendations, advisor, advisor status, and AI-native features.
- Safe request validation and error handling.
- No hardcoded secrets.

The app currently uses local catalog data by default. Supabase public URL/anon variables are detected for configuration status, but a Supabase data adapter is not connected.

## Role 3 - AI Engineer

AI work delivered a tool-based architecture rather than plain chat only:

- `POST /api/advisor` advisor route.
- OpenAI SDK integration when `OPENAI_API_KEY` is configured.
- Deterministic/catalog fallback when OpenAI is missing or unavailable.
- Catalog-grounding rules so the advisor only recommends known programs.
- Tool/function-calling style advisor flow.
- Internal tools:
  - `searchPrograms`
  - `comparePrograms`
  - `getProgramRequirements`
  - `calculateAdmissionChance`
  - `saveStudentPreferences`

Additional AI-native features implemented:

- `POST /api/ai/profile-parser`
- `POST /api/ai/smart-search`
- `POST /api/ai/program-insight`
- `POST /api/ai/compare-summary`
- `POST /api/ai/admission-roadmap`
- `GET /api/advisor/status`

The AI layer is designed not to hallucinate university options, requirements, deadlines, or guarantees. Guidance is based on available catalog data and should be verified on official university pages.

## Role 4 - QA / Workflow Master

QA/workflow work delivered verification and submission preparation:

- Installed and configured `@playwright/test`.
- Added `unimatch-ai/playwright.config.ts`.
- Added E2E tests under `unimatch-ai/tests/e2e/`.
- Added scripts:
  - `npm run test:e2e`
  - `npm run test:e2e:ui`
- Ran lint, build, and E2E checks locally.
- Updated documentation for local setup, tests, deployment, and evidence.
- Added evidence checklists and deployment checklist under `docs/evidence/`.

Playwright coverage includes homepage smoke, catalog, filter, admission fit, compare/shortlist, and advisor fallback/catalog answer flows.

## MCP Usage

MCP was used as support for the solo workflow, not as evidence of a team.

- Context7 MCP - used to fetch current documentation for framework/library work such as Next.js, OpenAI SDK/tool-calling, Vercel, and Playwright setup.
- Playwright MCP / browser tooling - used for local browser QA support and page inspection during frontend and QA work.
- Supabase MCP - planned for backend/data inspection if a Supabase project is connected; no Supabase-backed data adapter is currently implemented.
- GitHub MCP - available for repository/workflow review if needed; final docs do not claim PR review or external approval.

Detailed MCP screenshots are not currently committed as evidence.

## Codex Subagents

Subagent docs are instruction files for role phases, not human teammates:

- Frontend UI/UX Subagent: `docs/subagents/frontend-ui.md`
- Backend/API/Data Subagent: `docs/subagents/backend-api.md`
- AI Advisor/Tools Subagent: `docs/subagents/ai-advisor.md`
- QA/Workflow Subagent: `docs/subagents/qa-workflow.md`

These files helped structure the work across frontend, backend, AI, and QA responsibilities.

## AI-Native Product Features

Implemented AI-native product features:

- AI advisor grounded in catalog tools.
- AI profile parser for pasted study goals.
- AI smart search for natural-language program search.
- AI program insight for fit explanations.
- AI compare summary for shortlisted programs.
- AI admission roadmap after recommendation results.
- Recommendation tools and local catalog fallback.

## Where AI Saved Time

- Drafting and iterating the premium student-facing UI.
- Creating typed API boilerplate and validation patterns.
- Expanding the local university/program dataset.
- Designing the tool-based AI advisor architecture.
- Adding AI-native workflow routes and frontend states.
- Producing workflow docs, evidence checklists, and QA plans.
- Debugging wording/layout issues quickly after product direction changed.

## Where AI Failed

- The first frontend direction exposed internal workflow evidence in public UI, which had to be removed.
- Advisor fallback copy was initially too technical for a student-facing product.
- The profile form degree-level segmented control had layout/polish issues.
- OpenAI environment/status behavior needed careful wording so users did not see missing-key or provider details.
- Product direction still required human correction to keep the app focused on student admissions rather than implementation evidence.

## What Would Take 3x Longer Without AI

- Building the full UI component set and responsive states.
- Writing the data/API layer and recommendation flow.
- Implementing multiple AI routes with typed contracts.
- Creating advisor tools and fallback behavior.
- Producing submission-ready README, workflow, and evidence docs.
- Preparing Playwright coverage across the main workflow.

## Evidence Checklist

- [ ] Screenshot of app homepage
- [ ] Screenshot of catalog/filter
- [ ] Screenshot of AI advisor working
- [ ] Screenshot of AI features if present
- [ ] Screenshot of Codex usage
- [ ] Screenshot of MCP list/usage
- [ ] Screenshot of Playwright test run
- [ ] Screenshot of Vercel deployment
- [ ] Video demo link

Evidence notes and checklists are stored in `docs/evidence/`. Screenshots are not currently committed unless added later.

## Final Submission Checklist

- [ ] GitHub repository
- [ ] Deployed link
- [x] README
- [x] WORKFLOW
- [x] `ai-rules/`
- [x] `AGENTS.md`
- [x] `docs/subagents/`
- [x] `docs/evidence/`
- [x] Tests/build status
- [ ] Video demo
