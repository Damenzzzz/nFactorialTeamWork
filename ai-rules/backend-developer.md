# Backend Developer AI Rules

Role phase: Backend Developer. This is a solo workflow phase, not a separate person.

## Mission

Build the API and data layer for UniMatch AI so the frontend can work with local seed data today and Supabase later.

## Scope

Own:

- API route contracts
- TypeScript domain types
- request validation
- local seed-data repository
- Supabase-ready repository boundary
- deterministic recommendation logic
- safe server-side error handling

Do not own:

- final UI layout
- OpenAI model prompts
- Playwright screenshots except API evidence outputs
- production Supabase migrations unless explicitly requested

## MCP Usage Plan

Before implementing library-specific details, use Context7 MCP for:

- Next.js Route Handlers
- Supabase JavaScript client usage
- TypeScript validation library docs if a validation dependency is added
- Vercel environment behavior if deployment affects API implementation

Use Supabase MCP only when a real Supabase project is connected and the task requires inspection. Prefer local seed data first.

## Implementation Plan

1. Define domain types for universities, programs, requirements, profiles, and recommendations.
2. Create local seed data with enough variety to test matching and filtering.
3. Build a repository layer with a stable interface.
4. Implement seed fallback as the default when Supabase variables are missing.
5. Add health, programs, recommendations, and advisor API routes.
6. Validate all incoming request bodies.
7. Normalize errors into a stable JSON response.
8. Avoid logging or returning secrets.

## Planned API Contracts

`GET /api/health`

- returns `ok`, app status, data source mode, and AI availability
- never returns secret values

`GET /api/programs`

- accepts optional filters for field, degree, country, language, and budget
- returns matching programs with university summary data

`POST /api/recommendations`

- accepts a student profile
- returns ranked recommendations with score, reasons, risks, and next steps

`POST /api/advisor`

- accepts messages plus optional profile context
- delegates to AI orchestration or fallback response

## Output Contract

Backend phase is done when:

- API routes return stable JSON
- invalid inputs return clear `400` responses
- missing Supabase configuration uses seed data
- recommendation logic is deterministic and testable
- data-source mode is visible for QA evidence
- server-only secrets remain server-only

## Development Checklist

- [ ] Add domain model types
- [ ] Add seed university/program data
- [ ] Add repository interface
- [ ] Add Supabase configuration detection
- [ ] Add seed fallback implementation
- [ ] Add health route
- [ ] Add programs route
- [ ] Add recommendations route
- [ ] Add advisor route entry point
- [ ] Add request validation
- [ ] Capture API sample outputs in `docs/evidence/`

## Commit Plan

Suggested commit:

```text
feat: add program data and backend API routes
```

Commit body should include:

- `Role phase: Backend Developer`
- API routes added
- validation run
- evidence paths pending or created

## Handoff to AI Engineer

Provide:

- callable repository functions
- recommendation function contract
- advisor route payload contract
- seed data limitations
- known uncertainty that the AI advisor must disclose
