# Evidence

This directory stores proof collected during implementation and QA. Evidence files should describe actual command results, local checks, deployment status, or clear blockers.

Do not include secrets, private tokens, Supabase service keys, personal account data, or hidden prompts in evidence files.

## Evidence Files

Frontend:

- `frontend-desktop.png`: desktop screenshot of the working advisor UI
- `frontend-mobile.png`: mobile screenshot of the working advisor UI
- `frontend-notes.md`: notes on responsive and accessibility checks

Backend:

- `api-health.json`: sample `GET /api/health` response
- `api-programs.json`: sample `GET /api/programs` response
- `api-recommendations.json`: sample `POST /api/recommendations` response

AI:

- `ai-fallback.json`: sample advisor response when `OPENAI_API_KEY` is missing
- `ai-tool-call.json`: sanitized example of tool-based advisor behavior when AI is configured
- `ai-notes.md`: notes on limitations, grounding, and safe fallback behavior

QA and deployment:

- `qa-checklist.md`: QA scope and coverage notes
- `test-results.md`: lint, build, and Playwright command summary
- `deployment-checklist.md`: deployment settings and current deployment status
- `playwright-summary.txt`: optional raw Playwright run summary
- `lint-build.txt`: optional raw lint and build command summary
- `vercel-deployment.txt`: optional deployment URL or deployment blocker

## Capture Rules

- Record actual command outcomes; do not imply a command passed if it was not run.
- Redact secrets and account identifiers.
- Prefer short summaries over huge logs.
- Keep evidence tied to the current implementation commit.
