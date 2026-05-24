# AI Advisor Evidence

Date: 2026-05-24

Role phase: AI Engineer

## Commands

Run from `unimatch-ai/`:

- `npm run lint` - passed with ESLint.
- `npm run build` - passed with Next.js 16.2.6; `/api/advisor` was included as a dynamic route.

## Fallback Smoke Test

`POST /api/advisor` was tested locally without `OPENAI_API_KEY`.

Result summary:

- `ok: true`
- `data.aiAvailable: false`
- `toolsUsed`: `saveStudentPreferences`, `comparePrograms`, `calculateAdmissionChance`
- response included deterministic recommendations from the UniMatch catalog
- response included compared program objects for the supplied shortlist
- no secrets, provider errors, or stack traces were returned

## Browser Check

The local app was opened at `http://localhost:3000`.

Observed results:

- AI Advisor section rendered.
- Asking a question without an API key returned the catalog fallback.
- After submitting the profile form, the advisor returned recommended programs.
- The subtle expandable "How this answer was generated" detail was present.
