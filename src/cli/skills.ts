// ═══════════════════════════════════════════════════════════════
// CITADEL — Engineering Standards & Skills
// Written to .citadel/skills/ — loaded per context by agents
// ═══════════════════════════════════════════════════════════════

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function writeSkills(citadelPath: string): void {
  const d = join(citadelPath, 'skills');
  mkdirSync(d, { recursive: true });

  // ══════════════════════════════════════════
  // ESSENTIAL — loaded EVERY response by every agent
  // Target: < 800 tokens
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'rules_essential.md'), `# Essential Rules (P0 — Always Active)

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
- Read \`.citadel/vault/ARCHITECTURE.md\` — don't contradict existing decisions.
- Read \`.citadel/vault/CODE_INVENTORY.md\` — know what exists before creating new files.
- If something similar exists, extend it. Don't duplicate.
`, 'utf-8');

  // ══════════════════════════════════════════
  // BACKEND SKILLS — loaded when building backend
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_backend.md'), `# Backend Engineering Skills

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
  // DATA SKILLS — loaded when designing data layer
  // ══════════════════════════════════════════
  writeFileSync(join(d, 'skills_data.md'), `# Data Engineering Skills

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
}
