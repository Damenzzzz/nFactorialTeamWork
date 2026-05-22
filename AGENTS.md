# Codex Guidance: UniMatch AI

UniMatch AI is a solo role-based AI-native sprint project for an AI University Admission Advisor. The role names in this repository are workflow phases for one developer using Codex, not a team roster.

Do not invent participants, authors, reviewers, approvals, or team activity. Document work as a solo implementation that moves through specialized role phases.

## Repository Structure

```text
.
  README.md                 Project overview, implementation plan, contracts
  WORKFLOW.md               Solo role-based workflow and delivery process
  AGENTS.md                 Codex operating guidance for the whole repo
  ai-rules/                 Role-phase rules for AI-assisted implementation
  docs/
    evidence/               Verification artifacts and placeholders
    subagents/              Detailed Codex subagent guidance
  unimatch-ai/              Next.js App Router application
    src/app/                App Router pages, layouts, route handlers
    public/                 Static assets
    package.json            App scripts and dependencies
```

Primary implementation work belongs in `unimatch-ai/`. Root-level files are for documentation, workflow, AI rules, and evidence unless a task explicitly says otherwise.

## How To Run The App

Run commands from `unimatch-ai/`:

```bash
npm install
npm run dev
```

The dev server should start on `http://localhost:3000` unless the port is already in use.

Production checks:

```bash
npm run build
npm run start
```

## Lint And Tests

Current lint command:

```bash
cd unimatch-ai
npm run lint
```

Playwright tests are a required project deliverable, but the current app scaffold does not yet define a test script. When Playwright is added, prefer adding explicit scripts such as:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

After that, run:

```bash
cd unimatch-ai
npm run test:e2e
```

If tests are not yet installed, state that clearly in evidence instead of implying they passed.

## Solo Role-Based Workflow

Use these role phases to structure work:

1. Frontend UI/UX
2. Backend/API/Data
3. AI Advisor/Tools
4. QA/Workflow

The phases may be revisited as issues are found. Treat each phase as a lens for quality and ownership, not as a separate person. Commit messages and documentation may name the role phase, but must not name fake people or fake participants.

Subagent guidance:

- `docs/subagents/frontend-ui.md`
- `docs/subagents/backend-api.md`
- `docs/subagents/ai-advisor.md`
- `docs/subagents/qa-workflow.md`

## MCP And Tool Usage

Use MCP when it materially improves accuracy or verification:

- Context7: use for current framework, SDK, API, CLI, and cloud documentation, especially Next.js, React, Tailwind, Supabase, OpenAI, Playwright, and Vercel.
- Supabase: use for database/backend planning, schema inspection, logs, and advisors when a Supabase project is connected. The app must still work with local seed data.
- Playwright or Browser tooling: use for browser QA, local UI inspection, screenshots, and end-to-end flow verification.
- GitHub: use for repository, PR, issue, workflow, or CI review when requested or relevant.

Do not use MCP output as evidence of other participants. It is tool-assisted solo work.

## Coding Rules

- Follow the existing Next.js App Router structure in `unimatch-ai/`.
- Use TypeScript for application code and shared contracts.
- Keep frontend, backend, data access, AI tools, and tests separated by clear module boundaries.
- Prefer small, typed functions over large mixed-responsibility modules.
- Keep API response shapes stable and documented.
- Use local seed data as the default fallback path.
- Add Supabase integration behind a repository/data-access boundary.
- Keep AI advisor logic tool-based; do not reduce it to plain GPT chat.
- Make fallback behavior explicit for missing OpenAI or Supabase configuration.
- Use accessible labels, meaningful loading states, empty states, and error states.
- Keep UI responsive across desktop and mobile.
- Add tests for behavior that affects recommendations, advisor responses, or user flows.
- Do not refactor unrelated files during a focused task.

## Security Rules

- Never hardcode secrets, API keys, tokens, project passwords, or private URLs.
- Never commit `.env.local` or secret-bearing evidence files.
- Use `OPENAI_API_KEY` only in server-side code.
- Use Supabase service-role keys only server-side if they are ever needed.
- Public Supabase anon keys may be browser-visible, but do not treat them as authorization.
- Do not expose stack traces, secrets, hidden prompts, or raw provider errors in API responses.
- Do not create fake participants, fake authors, fake reviewers, fake approvals, or fake team notes.
- Do not hallucinate university data, rankings, requirements, deadlines, or admission guarantees.

## Definition Of Done

A sprint slice is done only when:

- the app runs locally from `unimatch-ai/`
- the feature works without Supabase by using local seed data
- the advisor route works safely without `OPENAI_API_KEY`
- AI-backed advisor behavior uses declared tools when an API key is configured
- lint passes, or failures are documented with exact blockers
- Playwright tests cover the relevant main path and fallback path, once Playwright is installed
- README and WORKFLOW remain accurate
- evidence is captured under `docs/evidence/`
- no secrets or fake participant records are introduced

## Evidence Expectations

Use `docs/evidence/` for concise proof:

- command summaries for lint, build, and tests
- API sample responses with secrets redacted
- screenshots from browser QA
- AI fallback output
- sanitized AI tool-call output when available
- deployment notes or blocker details

Evidence must describe actual results. If a command was not run, say so.

## Commit Guidance

Keep commits small and tied to one phase when possible:

```text
docs: define codex guidance files
feat: build admission advisor frontend
feat: add university data api
feat: add tool-based ai advisor
test: add playwright coverage
docs: record workflow evidence
```

Commit body format:

```text
Role phase: <Frontend UI/UX | Backend/API/Data | AI Advisor/Tools | QA/Workflow>

- Summary
- Validation
- Evidence
```

