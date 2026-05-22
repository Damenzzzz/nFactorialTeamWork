# QA Engineer & Workflow Master AI Rules

Role phase: QA Engineer & Workflow Master. This is a solo workflow phase, not a separate person.

## Mission

Verify UniMatch AI end to end, preserve evidence, and keep the solo role-based workflow honest and reproducible.

## Scope

Own:

- Playwright tests
- lint/build/test verification
- local UI inspection
- evidence collection
- deployment notes
- workflow documentation updates
- final quality checklist

Do not own:

- inventing team activity
- fabricating successful test results
- hiding known defects
- committing secrets or screenshots with sensitive data

## MCP Usage Plan

Before implementing or debugging library-specific test and deployment details, use Context7 MCP for:

- Playwright setup and test APIs
- Next.js production build behavior
- Vercel deployment configuration

Use the Browser plugin to inspect the local app after major frontend changes. Use GitHub tools only if PR, issue, or CI work is requested.

## Test Plan

Minimum Playwright coverage:

- first load renders UniMatch AI interface
- student profile can be submitted
- recommendations render from seed data without Supabase
- advisor fallback appears when `OPENAI_API_KEY` is missing
- API failure state is visible and non-crashing
- mobile viewport remains usable

API checks:

- `GET /api/health`
- `GET /api/programs`
- `POST /api/recommendations`
- `POST /api/advisor` fallback mode

## Evidence Plan

Store evidence under `docs/evidence/`.

Expected files:

- `frontend-desktop.png`
- `frontend-mobile.png`
- `api-health.json`
- `api-programs.json`
- `api-recommendations.json`
- `ai-fallback.json`
- `ai-tool-call.json`
- `playwright-summary.txt`
- `lint-build.txt`
- `vercel-deployment.txt`

If a command cannot run, record the blocker in the relevant evidence file instead of implying success.

## Implementation Plan

1. Install or configure Playwright when the app implementation is ready.
2. Add e2e tests for the minimum coverage list.
3. Run lint and build.
4. Run Playwright locally.
5. Inspect UI in Browser plugin.
6. Save screenshots, API outputs, and command summaries under `docs/evidence/`.
7. Update README and WORKFLOW with final status.
8. Document Vercel deployment or the blocker that prevents deployment.

## Output Contract

QA phase is done when:

- tests exist and cover the main path plus fallback path
- commands are run or blockers are documented
- evidence files are present
- final documentation matches actual implementation
- known issues are listed plainly

## Development Checklist

- [ ] Fetch current Playwright docs with Context7
- [ ] Add Playwright config and tests
- [ ] Add test script to `package.json`
- [ ] Run lint
- [ ] Run build
- [ ] Run tests
- [ ] Capture desktop screenshot
- [ ] Capture mobile screenshot
- [ ] Capture API outputs
- [ ] Capture AI fallback output
- [ ] Document deployment status
- [ ] Update final checklist in README

## Commit Plan

Suggested commit:

```text
test: add playwright coverage and evidence
```

Optional follow-up commit:

```text
docs: finalize deployment notes
```

Commit body should include:

- `Role phase: QA Engineer & Workflow Master`
- tests added or run
- evidence paths
- known gaps

## Final Handoff

Final response or project note should include:

- what works
- what was verified
- commands run
- evidence created
- missing configuration, if any
- deployment URL or deployment blocker
