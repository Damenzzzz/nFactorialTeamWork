# Frontend Developer AI Rules

Role phase: Frontend Developer. This is a solo workflow phase, not a separate person.

## Mission

Build the UniMatch AI user experience in the Next.js App Router app. The first screen should be the usable admission advisor interface, not a marketing page.

## Scope

Own:

- responsive advisor page
- student profile form
- recommendation results UI
- advisor conversation panel
- loading, empty, validation, API error, no-Supabase, and no-AI-key states
- shadcn-style UI primitives where useful

Do not own:

- final recommendation algorithm internals
- OpenAI tool orchestration
- Supabase schema changes
- Playwright evidence beyond making states testable

## MCP Usage Plan

Before implementing library-specific details, use Context7 MCP for:

- Next.js App Router rendering and client/server component guidance
- React form and state patterns when needed
- Tailwind CSS v4 syntax and configuration
- shadcn-style component setup if component primitives are added

Use the Browser plugin after meaningful UI work exists to inspect local behavior and catch layout issues.

## Implementation Plan

1. Inspect `unimatch-ai/src/app` and existing styling.
2. Replace the starter page with a focused advisor workspace.
3. Create reusable UI sections for profile input, filters, results, and advisor messages.
4. Keep API calls behind small frontend functions so backend contracts can evolve.
5. Make all states explicit: initial, loading, success, empty, validation error, API error, AI unavailable.
6. Ensure the app renders with no environment variables.
7. Keep copy honest: describe guidance as advisory, not guaranteed admission.

## Output Contract

Frontend phase is done when:

- the page renders without Supabase or OpenAI configuration
- the UI can submit a student profile to planned API endpoints
- recommendation and advisor areas have deterministic fallback states
- form fields are accessible and labeled
- desktop and mobile layouts are usable
- visual state hooks are clear enough for Playwright tests

## Development Checklist

- [ ] Update metadata from starter text to UniMatch AI
- [ ] Build profile form fields for degree, field, GPA, tests, budget, location, and language
- [ ] Add recommendation list shell
- [ ] Add advisor panel shell
- [ ] Add loading and error UI
- [ ] Add AI unavailable state
- [ ] Add seed-data unavailable state, even though seed data should normally exist
- [ ] Verify responsive layout manually
- [ ] Record planned screenshots in `docs/evidence/`

## Commit Plan

Suggested commit:

```text
feat: build admission advisor frontend shell
```

Commit body should include:

- `Role phase: Frontend Developer`
- UI areas changed
- validation run, if any
- evidence paths pending or created

## Handoff to Backend Developer

Provide:

- form payload shape
- expected recommendation response shape
- expected advisor request shape
- frontend states that depend on backend status
- unresolved assumptions about data fields
