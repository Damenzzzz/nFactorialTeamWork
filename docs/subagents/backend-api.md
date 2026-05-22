# Backend/API/Data Subagent

## Role

Own the data model, API routes, local fallback data, and Supabase-ready architecture for UniMatch AI. This is a solo workflow role phase, not a separate teammate.

## Responsibilities

- Define a typed university admission data model.
- Provide local seed-data fallback so the app works without Supabase.
- Design a Supabase-ready repository layer without requiring a connected project.
- Implement API routes for catalog, university details, filters, and related data.
- Keep request and response contracts stable and documented.
- Validate incoming parameters and request bodies.
- Return safe, predictable errors.
- Support AI advisor tools with reliable data-access functions.

## MCP/Tools To Use

- Context7 for current Next.js Route Handler and TypeScript-related library docs.
- Context7 for Supabase client usage before implementing Supabase-specific code.
- Supabase MCP for backend planning, schema inspection, logs, and advisors when a project is connected.
- Local shell commands for lint, build, and API inspection.

## Inputs It Expects

- Frontend filter and detail requirements.
- AI tool data requirements.
- Product data model expectations from `README.md`.
- Security rules from `AGENTS.md`.
- Existing seed data, if present.

## Output Contract

Deliver backend/data code that:

- defines typed entities for universities, programs, requirements, deadlines, costs, locations, and student preferences
- returns catalog data with filters
- returns detail data for one university or program
- returns filter metadata for UI controls
- exposes repository functions usable by API routes and AI tools
- chooses Supabase when safely configured and seed data otherwise
- never exposes secrets or raw provider failures
- returns deterministic JSON responses

Planned API surface:

- `GET /api/health`
- `GET /api/universities`
- `GET /api/universities/[id]`
- `GET /api/filters`
- `POST /api/compare`
- `POST /api/recommendations`

The exact route list may be refined during implementation, but catalog, details, and filters must be covered.

## What It Must Not Do

- Do not make Supabase mandatory for local app use.
- Do not hardcode secrets, service keys, or project credentials.
- Do not return secret values in health checks.
- Do not mix UI rendering concerns into API/data modules.
- Do not let the AI advisor bypass the typed data-access layer for university facts.
- Do not create fake university requirements, deadlines, or rankings unless clearly marked as seed/sample data.
- Do not create fake participants, fake authors, or fake approvals.

## Final Checklist

- [ ] Data model types are defined.
- [ ] Local seed data is available.
- [ ] Repository layer supports seed fallback.
- [ ] Supabase configuration detection is isolated.
- [ ] Catalog API route exists.
- [ ] Detail API route exists.
- [ ] Filters API route exists.
- [ ] Compare or recommendations route exists.
- [ ] API errors are safe and structured.
- [ ] API contracts are documented or reflected in README/WORKFLOW.
- [ ] Lint/build has been run or blocker is documented.
- [ ] API evidence is planned or captured in `docs/evidence/`.

