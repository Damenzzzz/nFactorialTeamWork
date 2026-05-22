# AI Engineer AI Rules

Role phase: AI Engineer. This is a solo workflow phase, not a separate person.

## Mission

Build a tool-based AI admission advisor. The advisor must use defined tools for program facts and recommendations instead of answering as plain chat only.

## Scope

Own:

- advisor orchestration
- OpenAI tool definitions and schemas
- model instructions
- safe fallback when `OPENAI_API_KEY` is missing
- tool-result grounding
- uncertainty and safety language

Do not own:

- frontend visual implementation
- Supabase schema design
- general QA automation except AI-specific evidence

## MCP Usage Plan

Before implementing library-specific details, use Context7 MCP for:

- current OpenAI SDK usage
- tool-calling API patterns
- structured output or JSON schema support if used
- Next.js server runtime constraints for API routes

If OpenAI documentation is needed beyond Context7, use official OpenAI documentation only.

## Tool Plan

Planned tools:

- `searchPrograms`: find programs by field, degree, country, city, language, budget, and deadline
- `rankPrograms`: rank available programs against a student profile
- `getProgramRequirements`: return requirements for specific program IDs
- `explainRecommendation`: convert tool results into fit reasons, risks, and next steps

Tools should return structured data and should never expose hidden prompts, keys, or raw internal errors.

## Implementation Plan

1. Define advisor request and response types.
2. Define tool input and output schemas.
3. Wire tools to backend repository and recommendation functions.
4. Add system instructions that require grounded answers and prohibit fabricated guarantees.
5. Implement OpenAI execution only when `OPENAI_API_KEY` exists.
6. Implement deterministic fallback when the key is missing.
7. Ensure fallback can still reference seed-data recommendations when profile data is available.
8. Add evidence examples for tool-call and fallback behavior.

## Output Contract

AI phase is done when:

- the advisor route has a tool-based path
- missing `OPENAI_API_KEY` returns a safe advisor message
- the response includes answer text and structured recommendation support
- unsupported facts are phrased as unknown, not invented
- admissions advice includes next steps and caveats
- tool-call evidence can be recorded without secrets

## Fallback Contract

When AI is unavailable, return:

- `ok: true` or equivalent non-crashing status
- an `aiAvailable: false` indicator
- a clear message that AI guidance is not configured
- deterministic suggestions from recommendation logic when possible
- no stack traces or secret names beyond the expected missing configuration label

## Development Checklist

- [ ] Fetch current OpenAI tool-calling docs with Context7
- [ ] Define advisor types
- [ ] Define tool schemas
- [ ] Implement tool execution wrappers
- [ ] Add grounded system instructions
- [ ] Add missing-key fallback
- [ ] Add tool-result error handling
- [ ] Add AI evidence placeholders in `docs/evidence/`

## Commit Plan

Suggested commit:

```text
feat: add tool-based AI advisor with safe fallback
```

Commit body should include:

- `Role phase: AI Engineer`
- tools added
- fallback behavior
- validation run
- evidence paths pending or created

## Handoff to QA Engineer & Workflow Master

Provide:

- how to trigger AI fallback
- how to trigger tool-based response
- sample advisor request payload
- known model limitations
- evidence files that should be captured
