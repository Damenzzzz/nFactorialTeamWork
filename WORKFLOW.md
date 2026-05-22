# Solo Role-Based Workflow

UniMatch AI is a solo project. The workflow uses role phases to structure the work, not to represent a team. Every artifact should be written as the work of one developer switching responsibilities across frontend, backend, AI, and QA.

## Ground Rules

- Do not invent team members, reviewers, approvals, or authors.
- Do not hardcode secrets.
- Do not require Supabase for the app to work.
- Do not require an OpenAI API key for the app to render or return a safe advisor response.
- Use current documentation through Context7 MCP before implementing library-specific code.
- Keep commits small and tied to a clear role phase.
- Preserve evidence under `docs/evidence/` as implementation proof.

## Phase Order

1. Frontend Developer
2. Backend Developer
3. AI Engineer
4. QA Engineer & Workflow Master

The phases are sequential for planning clarity, but feedback can move backward. For example, QA may expose a backend contract issue, and the next commit can return to the Backend Developer phase.

## Phase 1: Frontend Developer

Goal: deliver the user-facing advisor experience.

Inputs:

- product scope from `README.md`
- role rules from `ai-rules/frontend-developer.md`
- existing Next.js app in `unimatch-ai/`

Implementation plan:

- inspect the starter App Router structure
- fetch current Next.js, React, Tailwind CSS, and shadcn-style documentation through Context7 before implementation details are chosen
- create a focused first screen for the actual advisor experience, not a marketing landing page
- build student profile inputs, recommendation display, and advisor panel
- add loading, empty, validation, API error, no-Supabase, and no-AI-key states
- keep components small enough for later backend wiring

Output contract:

- `unimatch-ai/src/app/page.tsx` renders a working UI shell
- UI does not depend on Supabase or OpenAI
- calls are isolated behind functions or API endpoints
- visual states are testable by Playwright

Evidence placeholders:

- `docs/evidence/frontend-desktop.png`
- `docs/evidence/frontend-mobile.png`
- `docs/evidence/frontend-notes.md`

Suggested commit:

- `feat: build admission advisor frontend shell`

## Phase 2: Backend Developer

Goal: deliver stable API contracts and data access.

Inputs:

- frontend payload needs
- role rules from `ai-rules/backend-developer.md`
- local seed-data requirement

Implementation plan:

- fetch current Next.js Route Handler and Supabase documentation through Context7
- define TypeScript domain models and request/response contracts
- create seed data for universities, programs, and requirements
- implement repository functions that choose Supabase when configured and seed data otherwise
- add API routes for health, programs, recommendations, and advisor entry
- validate request bodies and return safe structured errors

Output contract:

- APIs return deterministic JSON
- data mode is visible as `seed` or `supabase`
- Supabase absence is expected behavior, not an error
- no response leaks server secrets

Evidence placeholders:

- `docs/evidence/api-health.json`
- `docs/evidence/api-programs.json`
- `docs/evidence/api-recommendations.json`

Suggested commit:

- `feat: add program data and backend API routes`

## Phase 3: AI Engineer

Goal: implement an AI advisor that uses tools.

Inputs:

- backend data functions
- recommendation logic
- role rules from `ai-rules/ai-engineer.md`

Implementation plan:

- fetch current OpenAI SDK/tool-calling documentation through Context7 before implementation
- define advisor tools for search, ranking, requirements lookup, and recommendation explanation
- keep tool schemas narrow and typed
- ensure the model cannot invent unsupported university facts when seed/Supabase data is available
- return a safe fallback response when `OPENAI_API_KEY` is missing
- include uncertainty and next-step language in advisor responses

Output contract:

- advisor route uses tools for facts and recommendations
- missing key produces safe non-crashing guidance
- tool results are structured and auditable
- prompt instructions prohibit fabricated admissions guarantees

Evidence placeholders:

- `docs/evidence/ai-tool-call.json`
- `docs/evidence/ai-fallback.json`
- `docs/evidence/ai-notes.md`

Suggested commit:

- `feat: add tool-based AI advisor with safe fallback`

## Phase 4: QA Engineer & Workflow Master

Goal: verify the app, record evidence, and prepare deployment.

Inputs:

- completed frontend, backend, and AI phases
- role rules from `ai-rules/qa-workflow-master.md`
- deployment target: Vercel

Implementation plan:

- fetch current Playwright and Vercel documentation through Context7 before setup or debugging
- add Playwright tests for first load, profile submission, recommendations, and AI fallback
- run lint, build, and tests locally
- inspect the local app with the Browser plugin after significant UI changes
- record command outputs and screenshots in `docs/evidence/`
- document deployment status and any blockers without exposing secrets

Output contract:

- test suite covers core user flows
- evidence files exist and match the current implementation
- README and workflow remain accurate
- final status clearly names known gaps

Evidence placeholders:

- `docs/evidence/playwright-summary.txt`
- `docs/evidence/lint-build.txt`
- `docs/evidence/vercel-deployment.txt`

Suggested commit:

- `test: add playwright coverage and evidence`

## MCP Usage Plan

Use MCP as execution support for the solo workflow:

- Context7 MCP is mandatory for library, framework, SDK, API, CLI, and cloud-service questions before implementation or debugging.
- Browser plugin is used for local visual verification after the frontend exists.
- Supabase MCP is used only if a Supabase project is connected; inspect before changing remote state.
- GitHub MCP is used only if repository, PR, issue, or CI work is requested.
- Figma MCP is not required unless a design artifact is explicitly requested.

MCP output should inform implementation notes and evidence. It should not be described as work done by other people.

## Output Contracts

Every phase must finish with a short handoff note that includes:

- files changed
- commands run
- evidence created or pending
- risks or assumptions
- next phase input requirements

API contracts should be documented near the implementation and summarized in README when finalized.

AI tool contracts should include:

- tool name
- input schema
- output schema
- failure behavior
- data source used

QA contracts should include:

- tested scenario
- command or Playwright test name
- expected result
- evidence file

## Commit Plan

Use these commits unless implementation constraints justify a smaller split:

1. `docs: define solo role-based sprint workflow`
2. `feat: build admission advisor frontend shell`
3. `feat: add program data and backend API routes`
4. `feat: add tool-based AI advisor with safe fallback`
5. `test: add playwright coverage and evidence`
6. `docs: finalize deployment notes`

Commit body format:

```text
Role phase: <Frontend Developer | Backend Developer | AI Engineer | QA Engineer & Workflow Master>

- Summary of work
- Validation run
- Evidence path, if any
```

## Development Checklist

- [ ] Confirm starter app builds before feature work
- [ ] Fetch current docs with Context7 before library-specific implementation
- [ ] Build frontend advisor interface
- [ ] Add API routes and validation
- [ ] Add local seed data fallback
- [ ] Add Supabase-ready repository layer
- [ ] Add OpenAI tool-calling advisor
- [ ] Add missing-key fallback
- [ ] Add Playwright tests
- [ ] Run lint
- [ ] Run build
- [ ] Run tests
- [ ] Capture screenshots and API outputs
- [ ] Document deployment or blockers

## Definition of Done

The sprint is complete when:

- the app runs locally without Supabase
- the advisor route returns a safe response without `OPENAI_API_KEY`
- the advisor uses tools when AI is configured
- Playwright covers the main path and fallback path
- lint/build/test status is recorded
- evidence files are present under `docs/evidence/`
- documentation accurately describes the solo role-based workflow
