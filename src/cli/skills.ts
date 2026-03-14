// ═══════════════════════════════════════════════════════════════
// CITADEL — Engineering Standards & Skills
// Written to .citadel/skills/ — loaded per context by agents
// ═══════════════════════════════════════════════════════════════

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SKILL_FILE_COUNT = 15;

export function writeSkills(citadelPath: string): void {
  const d = join(citadelPath, 'skills');
  mkdirSync(d, { recursive: true });

  // ══════════════════════════════════════════
  // ESSENTIAL — loaded EVERY response by every agent
  // Target: < 800 tokens
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'rules_essential.md'), `# Essential Rules (P0 — Always Active)

## Progressive Disclosure
- Read the Section Index first.
- Jump only to the sections needed for the task at hand.
- Do not read the full file if one section is enough.

## Section Index
- Architecture
- Code Quality
- Security
- Testing
- Before Writing Code

## Architecture
- Business logic in service layer ONLY. Never in controllers, routes, or DB layer.
- Max 200 lines per file. Max 30 lines per function. No exceptions.
- One file = one responsibility. If you need a comment to explain what the file does, the file does too much.
- No framework lock-in. Abstractions at boundaries (DB, API, external services).

## Code Quality
- TypeScript strict mode. No \`any\` unless explicitly justified in a comment.
- Every function: typed input, typed output, typed errors. No implicit types.
- Named constants for all values. Zero magic numbers, zero magic strings.
- Error handling: explicit, typed, NEVER swallowed. Every catch must log or rethrow.
- No nested callbacks > 2 levels. Use async/await.
- Naming: intention-revealing. \`getUserById\` not \`getData\`. \`isActive\` not \`flag\`.

## Security
- Secrets in env vars ONLY. Never in code, comments, config files, or logs.
- All user input: validated + sanitized before use. No trust.
- Auth: bcrypt/argon2 for passwords. JWT with short expiry (15min) + refresh rotation.
- No PII in logs. Ever. Mask or hash.

## Testing
- Every public function has at least one test.
- Test pyramid: 70% unit, 20% integration, 10% e2e.
- Tests must be fast, independent, repeatable. No order dependency.

## Before Writing Code
- Read \`citadel/ARCHITECTURE.md\` — don't contradict existing decisions.
- Read \`citadel/CODEBASE.md\` — know what exists before creating new files.
- If something similar exists, extend it. Don't duplicate.
`, 'utf-8');

  // ══════════════════════════════════════════
  // BACKEND SKILLS — loaded when building backend
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_backend.md'), `# Backend Engineering Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the sections that match the current backend change.
- If the task is only about auth, errors, or DB, do not load the rest.

## Section Index
- API Design
- Service Layer Pattern
- Error Handling
- Database
- Async and Performance

## API Design
- RESTful: proper HTTP methods (GET=read, POST=create, PUT=replace, PATCH=update, DELETE=delete).
- Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable, 500 Internal.
- Error response schema: \`{ error: { code: string, message: string, details?: object } }\`
- Pagination on all list endpoints: \`?page=1&limit=20\` → response includes \`{ data, total, page, pages }\`.
- Version APIs: \`/api/v1/\` from day 1.
- Rate limiting: document in API spec, return 429 Too Many Requests.

## Service Layer Pattern
\`\`\`
controller (HTTP) → service (business logic) → repository (data access) → DB
\`\`\`
- Controllers: parse request, call service, format response. ZERO logic.
- Services: all business rules, validation, orchestration. Testable without HTTP.
- Repositories: data access only. No business logic. Swappable.

## Error Handling
- Custom error classes: \`NotFoundError\`, \`ValidationError\`, \`AuthError\`, \`ConflictError\`.
- Global error handler catches and formats. Services throw typed errors.
- Never return 200 with an error body. Use proper status codes.

## Database
- Migrations: timestamped, reversible (UP + DOWN), idempotent.
- Every table: \`id\` (UUID or auto-increment), \`created_at\`, \`updated_at\`.
- Foreign keys on every relationship. Indexes on every query predicate.
- Soft delete (\`deleted_at\`) for user-facing data. Hard delete only for ephemeral data.
- Connection pooling. Never open/close per request.

## Async & Performance
- N+1 queries: detect and eliminate. Use \`JOIN\` or batch loading.
- Long operations: queue them (background job). Never block the request.
- Cache strategy: define TTL per endpoint. Invalidate on write.
- API response time budget: p95 < 200ms.
`, 'utf-8');

  // ══════════════════════════════════════════
  // FRONTEND SKILLS — loaded when building frontend
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_frontend.md'), `# Frontend Engineering Skills

## Progressive Disclosure
- Start with the Section Index.
- Load only the sections relevant to the current UI task.
- For pure responsiveness or forms work, do not reread the whole file.

## Section Index
- Components
- State Management
- Performance
- Forms
- Mobile and Responsive

## Components
- Max 150 lines per component. Split smart (logic) vs dumb (display).
- State flows down (props). Events flow up (callbacks). No prop drilling > 2 levels.
- Every component handles 4 states: loading, empty, success, error.
- No inline styles. Use design tokens, CSS variables, or utility classes (Tailwind).
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, focus management.

## State Management
- Local state first (useState). Lift only when 2+ components need the same data.
- Server state: use React Query/SWR/TanStack. Don't put API data in global state.
- URL is state: filters, pagination, tabs belong in the URL (shareable, bookmarkable).

## Performance
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1.
- Images: lazy loading, proper sizing, WebP/AVIF format, width+height attributes.
- Bundle: code-split per route. No single 500KB bundle.
- Fonts: \`font-display: swap\`. Preload critical fonts.

## Forms
- Validation: client-side for UX, server-side for security. Both. Always.
- Error messages: what went wrong + how to fix it. Not just "Invalid input."
- Disable submit button during submission. Show loading state.
- Preserve user input on error. Never clear the form on validation failure.

## Mobile / Responsive
- Mobile-first CSS: default styles = mobile, \`@media (min-width)\` for larger screens.
- Touch targets: minimum 44x44px. No tiny buttons.
- Test on real device widths: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad).
- No horizontal scrolling. Ever.
`, 'utf-8');

  // ══════════════════════════════════════════
  // UI/UX SKILLS — loaded when designing/building UI
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_uiux.md'), `# UI/UX Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the design sections that match the current decision.
- Use this file for interaction and UX structure, not for unrelated implementation detail.

## Section Index
- Design Principles
- Layout
- Colors and Typography
- Interaction
- Mobile PWA

## Design Principles (Dieter Rams — Less but Better)
- Remove until only the essential remains. If it doesn't serve the user's intent, delete it.
- Max 3 primary actions per screen. One should be obviously the main one.
- Consistency: same action = same pattern everywhere. Don't invent new UI for existing patterns.
- Progressive disclosure: show the minimum, reveal details on demand.

## Layout
- Visual hierarchy: size, weight, color, spacing — in that order of impact.
- Whitespace is a feature. Dense UI = cognitive overload.
- Alignment: everything on a grid. No "close enough."
- Z-pattern (landing pages) or F-pattern (content pages) for reading flow.

## Colors & Typography
- Max 2 font families. One for headings, one for body. Or one for everything.
- Type scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48. Don't invent random sizes.
- Color: one primary, one secondary, one danger, one success, grays for everything else.
- Contrast ratio: 4.5:1 minimum for text (WCAG AA). Use a contrast checker.

## Interaction
- Feedback for every action: click → visual response within 100ms.
- Loading states: skeleton screens > spinners > blank pages.
- Error states: explain what happened, why, and how to fix it. With a clear action button.
- Empty states: not just "No data." Explain what this page will show and how to get started.

## Mobile PWA
- 60fps scrolling. Test on mid-range devices, not just your MacBook.
- Bottom navigation for primary actions (thumb zone). Not top menus.
- Swipe gestures for common actions (back, delete, archive) — but always with a button fallback.
- Offline: show cached data + "You're offline" banner. Don't blank the screen.
`, 'utf-8');

  // ══════════════════════════════════════════
  // VISUAL DESIGN SKILLS — loaded for UI direction and polish
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_visual_design.md'), `# Visual Design Skills

## Progressive Disclosure
- Start with the Section Index.
- If the task is only typography, color, motion, or layout, jump directly there.
- Use this file to sharpen visual direction, not to replace functional UX review.

## Section Index
- Art Direction
- Typography
- Color
- Layout and Composition
- Motion and States

## Art Direction
- Start every UI task with 3 adjectives for the intended feel (for example: "calm, premium, fast").
- One product = one visual thesis. Avoid generic "default SaaS" styling with random gradients or copy-pasted cards.
- Use contrast with intent: large/small, dense/airy, quiet/loud. Not everything can be emphasized at once.

## Typography
- Choose a type pairing on purpose. One display face plus one body face is enough.
- Establish a type scale before designing components. Reuse it everywhere.
- Headings should look designed, not just bigger. Tune letter-spacing, line-height, and weight.
- Body text should remain easy to scan at mobile widths. Target 45-75 characters per line.

## Color
- Define a restrained palette: foundation neutrals, one primary accent, one support accent, semantic colors.
- Use accent colors sparingly. If everything is highlighted, nothing is highlighted.
- Surfaces should have depth: layered backgrounds, borders, shadows, texture, or subtle tonal shifts.
- Contrast is a design tool and an accessibility requirement. Text must meet WCAG AA minimum.

## Layout and Composition
- Use a deliberate spacing scale. Repeated spacing values should come from tokens, not guesswork.
- Build clear focal points: what should the eye see first, second, third.
- Mix stable structure with one memorable element: a strong hero, card treatment, illustration, or motion pattern.
- Empty space is allowed. Crowded screens feel cheaper and harder to trust.

## Motion and States
- Motion should explain changes in state, not decorate them.
- Prefer 150-250ms transitions for UI feedback. Longer only when a scene change needs emphasis.
- Hover, focus, active, disabled, loading, empty, and error states must feel part of the same system.
- Respect reduced motion preferences and keep motion optional for core usability.
`, 'utf-8');

  // ══════════════════════════════════════════
  // DESIGN SYSTEM SKILLS — loaded when design tokens/components matter
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_design_system.md'), `# Design System Skills

## Progressive Disclosure
- Start with the Section Index.
- If the task is only tokens, variants, or state coverage, read that section only.
- Do not load this whole skill for a one-line CSS tweak unless system rules are affected.

## Section Index
- Tokens First
- Component Contracts
- State Coverage
- System Hygiene

## Tokens First
- Tokenize color, spacing, typography, radius, shadow, border, and motion values before scaling components.
- Token names should describe intent: \`color.surface.raised\`, \`space.300\`, \`radius.lg\`.
- Components may consume tokens. They must not invent one-off values without justification.

## Component Contracts
- Every component defines: purpose, props, variants, states, accessibility contract, and responsive behavior.
- Variants must be explicit. Avoid boolean prop soup like \`primary secondary subtle compact\`.
- Shared primitives come first: button, input, card, badge, modal, empty state, section header.
- If three screens need the same pattern, promote it to a reusable component.

## State Coverage
- Each component documents default, hover, focus, active, disabled, loading, success, warning, and error when relevant.
- Empty states and skeletons are part of the system, not last-minute add-ons.
- Interactive components must expose visible focus styles and proper disabled semantics.

## System Hygiene
- Keep a single source of truth for tokens and component examples.
- When changing a token, review all impacted components before shipping.
- Prefer composition over inheritance. Small primitives assembled intentionally age better.
- The design system should reduce decisions during implementation, not add ceremony.
`, 'utf-8');

  // ══════════════════════════════════════════
  // IMPLEMENTATION PLAN SKILLS — loaded before makers start coding
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_implementation_plan.md'), `# Implementation Plan Skills

## Progressive Disclosure
- Start with the Section Index.
- Read the plan structure first, then only the approval or format sections you need.
- This file is for planning and coordination, not for low-level coding detail.

## Section Index
- Before Any Code
- Minimum Plan Format
- Approval Rules

## Before Any Code
- The CTO writes an implementation plan before makers start.
- Plan sections: objective, impacted files, data/contracts touched, risks, tests, rollback, open questions.
- Makers can refine the plan, but they do not skip it.

## Minimum Plan Format
1. Goal: what changes for the user or system.
2. Scope: what is in, what is explicitly out.
3. Touch points: files, services, components, APIs, migrations, jobs.
4. Invariants: behavior that must not break.
5. Risks: architecture, UX, security, performance, data integrity.
6. Verification: tests, manual checks, observability signals.
7. Rollback: how to recover if the change fails.

## Approval Rules
- No maker implementation until LINUS has challenged the plan for unnecessary complexity.
- If the task affects UI, JONY reviews the visual/design implications before DAN codes it.
- If the task affects auth, data, or external integrations, relevant specialists add risks before implementation starts.
- The user sees the consolidated plan, not raw internal drafts, unless they explicitly ask for work-in-progress.
`, 'utf-8');

  // ══════════════════════════════════════════
  // CHANGE SAFETY SKILLS — loaded for coherence and regression review
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_change_safety.md'), `# Change Safety Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the review tactics or regression checklist relevant to the change.
- Use this skill when validating impact, not when ideating features.

## Section Index
- Coherence Review
- Regression Checklist
- Review Tactics
- Output Format

## Coherence Review
- Every non-trivial change gets a coherence review before it is presented as done.
- Coherence review checks architecture fit, contract compatibility, state consistency, and operational impact.
- "It works locally" is not a coherence verdict.

## Regression Checklist
- Existing user flows still work.
- Existing API contracts still match consumers.
- Existing state transitions still produce valid UI states.
- Existing auth, permissions, and validation still hold.
- Logging, monitoring, and analytics remain meaningful after the change.

## Review Tactics
- Compare before/after behavior for the critical path, not only changed lines.
- List assumptions explicitly. Hidden assumptions are where regressions hide.
- Flag partial implementations that create dead ends, broken states, or misleading UX.
- If a change weakens system coherence, raise a blocking flag and propose the smallest safe correction.

## Output Format
- Verdict: pass, pass with flags, or fail.
- Broken invariants: concrete list.
- Risk level: low, medium, high.
- Next action: merge, patch specific issue, or redesign approach.
`, 'utf-8');

  // ══════════════════════════════════════════
  // DATA SKILLS — loaded when designing data layer
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_data.md'), `# Data Engineering Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only schema, query, migration, or quality sections as needed.
- A simple query fix does not require reading the whole file.

## Section Index
- Schema Design
- Queries
- Migrations
- Data Quality

## Schema Design
- 3NF minimum. Denormalize only with documented reason (performance, read pattern).
- Every relationship has a foreign key constraint. No orphaned records.
- Naming: \`snake_case\` for tables and columns. Plural for tables (\`users\`, not \`user\`).
- Boolean columns: \`is_active\`, \`has_access\`. Verb prefix.
- Timestamp columns: \`_at\` suffix (\`created_at\`, \`updated_at\`, \`deleted_at\`).
- Enum columns: use DB-level enums or check constraints. Not free text.

## Queries
- SELECT only the columns you need. No \`SELECT *\` in production code.
- Every WHERE clause: check if an index exists. Add one if not.
- JOIN: prefer explicit INNER/LEFT JOIN over implicit comma-joins.
- Explain plan: run on every complex query before shipping.
- N+1: if you query inside a loop, you have a bug.

## Migrations
- One migration per logical change. Not one giant migration.
- Every UP has a DOWN. Test both.
- No destructive changes without a backup plan: rename → create new + migrate → drop old.
- Naming: \`YYYYMMDDHHMMSS_description.sql\` for ordering.

## Data Quality
- Null strategy: define per column. \`NOT NULL\` by default, nullable only when intentional.
- Validation at ingestion point. Never trust upstream data.
- Referential integrity: FK constraints, not "we'll check in the app."
- Audit trail: who changed what, when. At minimum \`updated_by\` + \`updated_at\`.
`, 'utf-8');

  // ══════════════════════════════════════════
  // SECURITY SKILLS — loaded during security review
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_security.md'), `# Security Skills

## Progressive Disclosure
- Start with the Section Index.
- If the task is login or auth, jump directly to Auth Patterns.
- If the task is headers, logging, or encryption, read only that section plus anything it depends on.

## Section Index
- OWASP Top 10 Checklist
- Auth Patterns
- Data Protection
- Headers

## OWASP Top 10 Checklist
- [ ] Injection: parameterized queries. No string concatenation for SQL.
- [ ] Broken Auth: bcrypt/argon2, JWT short expiry, refresh rotation, rate limiting on login.
- [ ] Sensitive Data Exposure: encrypt PII at rest (AES-256-GCM), TLS 1.3 in transit.
- [ ] XXE: disable external entity processing in XML parsers.
- [ ] Broken Access Control: check permissions server-side on every request. Never trust the client.
- [ ] Security Misconfiguration: no default credentials, no debug mode in production, no verbose errors exposed.
- [ ] XSS: escape all output. Use framework auto-escaping. CSP headers.
- [ ] Insecure Deserialization: validate and sanitize all incoming data structures.
- [ ] Known Vulnerabilities: audit dependencies weekly (\`npm audit\`, \`snyk\`).
- [ ] Insufficient Logging: log auth events, access failures, data modifications. Not PII.

## Auth Patterns
- Passwords: bcrypt (cost 12+) or argon2id. Never MD5/SHA for passwords.
- JWT: sign with RS256 or ES256. Short expiry (15min). Refresh tokens: single-use, stored server-side, rotate on use.
- Sessions: httpOnly + secure + sameSite cookies. No tokens in localStorage.
- MFA: TOTP (Google Authenticator style) or WebAuthn. SMS as fallback only.
- Rate limiting: 5 failed logins → account lockout for 15min. Exponential backoff.

## Data Protection
- Encryption at rest: AES-256-GCM for PII columns or full-disk encryption.
- Encryption in transit: TLS 1.3 minimum. HSTS header. No mixed content.
- Key management: rotate every 90 days. Store in vault (AWS KMS, HashiCorp Vault), never in code.
- Logs: sanitize PII before logging. No passwords, tokens, or personal data in log output.
- Backups: encrypted, tested monthly, stored in separate region.

## Headers
\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
\`\`\`
`, 'utf-8');

  // ══════════════════════════════════════════
  // MOBILE SKILLS — loaded when building mobile/PWA
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_mobile.md'), `# Mobile / PWA Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the sections needed for the current mobile or PWA concern.
- If the issue is offline sync, do not load the entire performance and touch guidance.

## Section Index
- Performance
- Offline-First
- PWA Requirements
- Touch and Mobile UX

## Performance
- 60fps: measure on mid-range devices. Avoid layout thrashing.
- Bundle: < 200KB initial JS. Code-split aggressively per route.
- Images: responsive srcset, lazy loading, AVIF/WebP with fallback.
- Animations: CSS transforms + opacity only (GPU-composited). No animating width/height/top/left.
- Service worker: precache critical assets. Cache-first for static, network-first for API.

## Offline-First
- App must render without network. Show cached data.
- Queue actions offline, sync when back online (optimistic UI).
- "You're offline" indicator: visible but not blocking.
- Conflict resolution strategy: last-write-wins or prompt user.

## PWA Requirements
- \`manifest.json\`: name, short_name, icons (192 + 512), start_url, display: standalone.
- Service worker: registered, handles fetch events, updates cleanly.
- HTTPS required. No PWA without it.
- Install prompt: defer until user engagement (don't show on first visit).

## Touch & Mobile UX
- Touch targets: 44x44px minimum. 48px preferred.
- Bottom navigation: primary actions within thumb reach.
- Pull-to-refresh for list screens.
- Haptic feedback on critical actions (iOS: UIImpactFeedbackGenerator, web: navigator.vibrate).
- Deep link every screen: any URL should open the right view.
- Handle: slow network, no network, low battery, background/foreground transitions.
`, 'utf-8');

  // ══════════════════════════════════════════
  // CONTEXT MANAGER SKILLS — loaded when resuming, handing off, or budgeting context
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_context_manager.md'), `# Context Manager Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the resume, handoff, or context-budget section you need.
- Do not dump the whole project history into context if a three-line summary is enough.

## Section Index
- Resume Protocol
- Handoff Protocol
- Context Budgeting
- Fresh Session Recovery

## Resume Protocol
- Read \`citadel/STATUS.md\` first. That file decides whether you need anything else.
- Read \`citadel/CONTEXT.md\` only if STATUS lacks enough detail to continue safely.
- Read \`citadel/HANDOFF.md\` when another session or collaborator prepared a continuation note.
- Pull in \`citadel/DECISIONS.md\`, \`citadel/ARCHITECTURE.md\`, or \`citadel/CODEBASE.md\` only for the parts touched by the current task.

## Handoff Protocol
- End each session with 4 things: current phase/mode, what changed, what must not break, and the next recommended step.
- Handoffs are written for tired humans and fresh agents. Prefer plain language over jargon.
- If a blocker exists, state the blocker first, then what evidence would unblock it.

## Context Budgeting
- Budget the context before loading files: light, medium, or heavy.
- Light: STATUS + one relevant file or skill.
- Medium: STATUS + CONTEXT/HANDOFF + one domain pod + one domain skill.
- Heavy: only when architecture or cross-cutting change requires decisions, code map, and multiple specialists.
- If the task fits in a light budget, refuse to inflate it.

## Fresh Session Recovery
- If the hub files are missing or empty, treat the project as fresh.
- If STATUS says Build or Fix, do not restart discovery from zero.
- If files disagree, trust the latest dated artifact and call out the inconsistency.
`, 'utf-8');

  // ══════════════════════════════════════════
  // HOTFIX / RCA SKILLS — loaded for bug fixing and day-30 maintenance
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_hotfix_rca.md'), `# Hotfix and RCA Skills

## Progressive Disclosure
- Start with the Section Index.
- Use Hotfix Flow for urgent patches and RCA for recurring or unclear failures.
- Do not read the whole file when you only need the patch checklist.

## Section Index
- Hotfix Flow
- Change Impact
- Verification
- RCA

## Hotfix Flow
1. Define the symptom in one sentence.
2. Identify the exact user flow, contract, or job that is broken.
3. Read \`citadel/RUNBOOK.md\` for existing run, deploy, and rollback guidance.
4. Patch the smallest surface that can restore the behavior safely.
5. Run checker review and coherence review before calling it fixed.

## Change Impact
- List files, services, components, contracts, and data touched by the fix.
- Call out what must not break: auth, billing, onboarding, notifications, analytics, or any protected flow.
- If the hotfix changes public behavior, update \`citadel/CHANGELOG.md\` and the relevant runbook note.

## Verification
- Reproduce before the fix when possible.
- Verify the primary failure path and at least one neighboring path that could regress.
- Check logs, alerts, or analytics if the bug lives in production behavior rather than local UI only.
- If rollback is safer than patching now, say so plainly.

## RCA
- State the root cause, not just the symptom.
- Distinguish between trigger, contributing factors, and missing safeguards.
- End with one prevention rule that can be enforced in process, code, tests, or docs.
`, 'utf-8');

  // ══════════════════════════════════════════
  // RELEASE / RUNBOOK SKILLS — loaded before ship or after operational changes
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_release_runbook.md'), `# Release and Runbook Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only release readiness, rollback, or monitoring sections as needed.
- This skill is for shipping safely, not for routine feature ideation.

## Section Index
- Release Readiness
- Rollback
- Monitoring
- Runbook Hygiene

## Release Readiness
- Confirm the scope that is actually shipping. Do not ship ambiguous work.
- Verify build, tests, migrations, environment variables, and feature flags.
- Call out user-facing changes, operational changes, and dependencies separately.
- No release is "done" until rollback and monitoring are defined.

## Rollback
- State the rollback trigger: what metric, error, or user signal means "undo this now".
- State the rollback path: revert deploy, disable feature flag, restore previous config, or run data rollback.
- If a DB migration is irreversible, call that out before ship and require a backup plan.

## Monitoring
- Define the first signals to watch: errors, auth failures, latency, job backlog, conversion drop, or support noise.
- For risky releases, identify a smoke test and a 15-minute watch window after deploy.
- If no monitoring exists, say the release is higher risk than it appears.

## Runbook Hygiene
- \`citadel/RUNBOOK.md\` should answer: how to run, how to deploy, how to rollback, what to monitor.
- Update the runbook when release behavior changes, not weeks later.
- Keep it short and operational. A runbook is for moments of pressure, not storytelling.
`, 'utf-8');

  // ══════════════════════════════════════════
  // DOCS COHERENCE SKILLS — loaded when code, docs, and plans may drift
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_docs_coherence.md'), `# Docs and Code Coherence Skills

## Progressive Disclosure
- Start with the Section Index.
- Read only the drift checks or update rules needed for the current task.
- Use this skill when code, docs, and plans may disagree.

## Section Index
- Drift Checks
- Required Documents
- Update Rules
- Output Format

## Drift Checks
- Compare the implementation plan, architecture notes, and codebase map against the actual change.
- Flag any statement that is no longer true because of the latest implementation.
- Pay special attention to auth, data flows, public APIs, and deployment steps.

## Required Documents
- \`citadel/DECISIONS.md\` for architectural or product decisions.
- \`citadel/ARCHITECTURE.md\` for system design and constraints.
- \`citadel/CODEBASE.md\` for file and pattern maps.
- \`citadel/RUNBOOK.md\` for operational behavior.
- \`citadel/HANDOFF.md\` when the current task changes what the next collaborator needs to know.

## Update Rules
- If code changes a documented behavior, update the document in the same session.
- If the document is stale but the change is unrelated, flag it instead of silently rewriting history.
- Prefer small, truthful updates over big "perfect" docs that never stay current.

## Output Format
- Coherent: yes or no.
- Drift found: exact docs or sections that no longer match reality.
- Required updates: smallest set of document edits needed to restore trust.
`, 'utf-8');
}
