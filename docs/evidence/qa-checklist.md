# QA Checklist

Date: 2026-05-24

Role phase: QA Engineer & Workflow Master. This is solo role-based verification work, not a team handoff.

## Coverage Added

- Homepage smoke: verifies the UniMatch AI page title, brand, and main CTA.
- Catalog: verifies the catalog section loads, filters are visible, and program cards render.
- Filters: applies a field filter and confirms the catalog remains in a valid results state.
- Admission fit: fills the profile form, submits Calculate fit, and confirms ranked recommendations with match scores.
- Compare/shortlist: adds two programs and verifies the compare section enables the AI comparison action.
- AI advisor: asks a simple question and confirms a catalog-grounded advisor answer without requiring real OpenAI usage.

## Stability Notes

- Tests use accessible selectors for buttons, inputs, labels, headings, and groups where available.
- Section IDs are used only to scope assertions to stable product areas.
- Tests avoid exact generated AI answer text and assert stable UI markers instead.
- Playwright starts the production server on port `3100` by default and clears `OPENAI_API_KEY` for the test server process.

## Remaining QA Gaps

- No visual regression baseline is defined yet.
- No mobile viewport E2E test is included in this slice.
- Supabase-backed data mode is not tested because no Supabase project is connected.
- Deployment was not executed from this environment.
