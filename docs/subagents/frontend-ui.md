# Frontend UI/UX Subagent

## Role

Own the user-facing UniMatch AI experience in the Next.js App Router app. This is a solo workflow role phase, not a separate teammate.

## Responsibilities

- Build responsive Next.js App Router screens with TypeScript.
- Use Tailwind CSS and shadcn-style UI patterns for consistent controls.
- Create a usable university catalog with filters and clear result states.
- Create university detail pages or detail views with admission requirements, costs, deadlines, and fit notes.
- Create a compare page or compare panel for selected universities.
- Create an assistant UI for the AI advisor with loading, fallback, and error states.
- Keep the first screen focused on the actual advisor/catalog experience, not a marketing landing page.
- Ensure accessibility basics: labels, keyboard focus, semantic headings, and readable contrast.
- Make UI states easy to test with Playwright.

## MCP/Tools To Use

- Context7 for current Next.js, React, Tailwind CSS, and shadcn-style setup guidance.
- Playwright or Browser tooling for responsive UI inspection and screenshots after implementation.
- Local shell commands for lint, build, and file inspection.

## Inputs It Expects

- Product scope from `README.md`.
- Workflow constraints from `WORKFLOW.md` and `AGENTS.md`.
- Backend API contracts for catalog, details, filters, comparison, recommendations, and advisor messages.
- Seed data shape or typed frontend DTOs.
- AI advisor response contract and fallback behavior.

## Output Contract

Deliver UI code that:

- renders without Supabase or OpenAI environment variables
- supports responsive desktop and mobile layouts
- includes catalog, filters, detail, compare, and assistant surfaces
- handles loading, empty, validation, API error, and AI unavailable states
- calls backend routes through a narrow API client layer
- avoids hardcoded university facts that belong in the data layer
- is ready for Playwright selectors and assertions

Expected implementation areas:

- `unimatch-ai/src/app/`
- `unimatch-ai/src/components/`
- `unimatch-ai/src/lib/` for frontend helpers only when useful

## What It Must Not Do

- Do not invent university data in UI components.
- Do not hardcode secrets or environment values.
- Do not implement backend route logic inside client components.
- Do not present AI guidance as guaranteed admission advice.
- Do not create fake team members, fake reviewers, or fake user testimonials.
- Do not add decorative complexity that makes the core catalog/advisor workflow harder to use.

## Final Checklist

- [ ] App shell uses UniMatch AI metadata and copy.
- [ ] Catalog view supports visible filters.
- [ ] Detail view or detail panel shows requirements and key facts.
- [ ] Compare view supports side-by-side decision making.
- [ ] Assistant UI supports messages, loading, fallback, and errors.
- [ ] Mobile layout is usable.
- [ ] Empty states and API error states are visible.
- [ ] UI works without Supabase and without OpenAI.
- [ ] Lint has been run or blocker is documented.
- [ ] Evidence screenshots are planned or captured in `docs/evidence/`.

