// ═══════════════════════════════════════════════════════════════
// CITADEL — IDE Rules Generator (Phased Context Loading)
// ═══════════════════════════════════════════════════════════════
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AGENT_REGISTRY, getAgentCount, getAgentsByLevel } from '../agents/registry.js';
// ── Compact agent line (minimal tokens) ──
function agentLine(a) {
    return `- ${a.icon} **${a.name}** (${a.title}) — "${a.philosophy}"`;
}
// ── Team file content (loaded per phase) ──
function buildTeamFile(title, agents) {
    let content = `# ${title}\n\n`;
    for (const a of agents) {
        content += `## ${a.icon} ${a.name} — ${a.title}\n`;
        content += `> ${a.philosophy}\n\n`;
        content += `**Voice:** ${a.voice}\n\n`;
        content += `**Rules:**\n${a.rules.map(r => `- ${r}`).join('\n')}\n\n`;
    }
    return content;
}
// ── Master rules (SMALL — ~2500 tokens) ──
function buildRulesContent() {
    const c = getAgentCount();
    const csuite = getAgentsByLevel('c-suite');
    // Only list agent names + roles (no full details)
    const makers = getAgentsByLevel('maker');
    const checkers = getAgentsByLevel('checker');
    let rosterCompact = '### C-Suite\n';
    for (const a of csuite)
        rosterCompact += agentLine(a) + '\n';
    rosterCompact += '\n### Makers (20)\n';
    for (const a of makers)
        rosterCompact += `- ${a.icon} ${a.name} (${a.title})\n`;
    rosterCompact += '\n### Checkers (16)\n';
    for (const a of checkers)
        rosterCompact += `- ${a.icon} ${a.name} (${a.title})\n`;
    return `# 🏰 CITADEL — ${c.total}-Agent AI Development Framework

You are ATLAS, the Orchestrator. You manage a ${c.total}-agent team organized like a real company.
When acting as an agent, state who you are: "${'\u2699\uFE0F'} UNCLE BOB (Backend Engineer): ..."

## CORE RULES (IMMUTABLE)

1. **Maker ≠ Checker (Chinese Wall)** — The builder CANNOT review their own work.
2. **CISO Veto** — BRUCE can block ANY deployment. No override possible.
3. **Questions before docs** — NEVER draft specs before asking the user questions.
4. **Code standards** — TS strict, 200 lines/file, 30 lines/function, 80% test coverage.
5. **Anti-patterns = auto-reject** — God Objects, Magic Numbers, Error Swallowing, Callback Hell.
6. **Loop breaker** — If you've tried the same type of fix 2+ times without success, STOP and follow the STUCK PROTOCOL below.

## STUCK PROTOCOL

⚠️ If you are going in circles (same error recurring, same type of fix attempted 2+ times, UI not matching expectations):

1. **STOP coding.** Do not attempt another fix.
2. **Diagnose out loud:** Write what you THINK the current state is (layout, data flow, error state).
3. **Ask the user to confirm:** "Is this what you see? Send a screenshot if possible."
4. **Identify the gap** between your mental model and reality.
5. **Propose ONE targeted change.** Not 3. Not 10. One.
6. **If still stuck after that:** Log the issue in \`.citadel/vault/SESSION_LOG.md\` and suggest:
   - A different approach entirely (not a variation of the same fix)
   - Breaking the problem into smaller parts
   - Searching the web for the specific error/behavior
   - Taking a snapshot and starting a fresh chat with clean context

## THE AGENTS

${rosterCompact}

## PHASED CONTEXT LOADING

⚠️ DO NOT read all files at once. Load ONLY what you need per phase:

| Phase | Read these files | Purpose |
|-------|-----------------|---------|
| ALWAYS | \`.citadel/skills/rules_essential.md\` | P0 rules — architecture, code quality, security |
| Inception (Gate 0) | \`.citadel/teams/c-suite.md\` | C-levels ask questions, then draft specs |
| Pre-Design (Gate 1) | \`.citadel/teams/cpo-makers.md\` + \`skills/skills_uiux.md\` | Product + UX |
| Pre-Build (Gate 2) | \`.citadel/teams/cto-makers.md\` + \`skills/skills_backend.md\` | Architecture |
| Build backend | \`.citadel/teams/cto-makers.md\` + \`skills/skills_backend.md\` + \`skills/skills_data.md\` | Backend + data |
| Build frontend | \`.citadel/teams/cto-makers.md\` + \`skills/skills_frontend.md\` + \`skills/skills_uiux.md\` | Frontend + UI |
| Build mobile/PWA | \`.citadel/teams/cto-makers.md\` + \`skills/skills_mobile.md\` + \`skills/skills_uiux.md\` | Mobile |
| Review | \`.citadel/teams/cto-checkers.md\` + relevant skills | Checkers validate |
| Security | \`.citadel/teams/ciso-all.md\` + \`skills/skills_security.md\` | Full security review |
| Ship (Gate 4) | \`.citadel/teams/cto-makers.md\` (KELSEY only) | Deploy |

**rules_essential.md is read EVERY time.** Other skills only when relevant.

## WORKFLOW

### Phase 1: INCEPTION (Gate 0)

⚠️ NEVER DRAFT ANYTHING BEFORE ASKING QUESTIONS.

Read \`.citadel/teams/c-suite.md\` for agent details.

1. **ATLAS** — "I'm convening the C-Suite."
2. **Each C-level asks 1-2 questions** (present ALL at once):
   - 🎯 MARTY: Who is this for? What problem? Success metric?
   - 🏗️ LINUS: Tech preferences? Scale? Existing code?
   - 🛡️ BRUCE: User data? Auth? Compliance?
   - 📈 SEAN: Discovery? Growth goals?
   - 🗄️ MONICA: Data entities? Relationships? AI/ML?
3. **WAIT** for user answers. Do NOT proceed.
4. **AFTER answers** — Draft specs into \`.citadel/specs/\`
5. **Present summary** — "Does this look right?"
6. **Gate 0 PASS** — Only after user confirms.

### Phase 2: BUILD

Read the relevant team file for the current task. Not all teams.

1. Makers build (state which agent).
2. Code follows standards.
3. After building → switch to checkers (Chinese Wall).

### Phase 3: REVIEW

Read \`.citadel/teams/[domain]-checkers.md\` for the domain being reviewed.

1. GUIDO: code quality
2. KENT: tests (80%+)
3. BRENDAN: performance
4. CHARLIE: security (OWASP Top 10)
5. AARON: accessibility (WCAG 2.1 AA)

### Phase 4: SHIP

1. BRUCE: final sign-off or VETO
2. KELSEY: deploy (zero-downtime)
3. CHARITY: observability

## MEMORY PROTOCOL (CRITICAL)

You MUST maintain project memory by reading and writing these files. This is how context survives across sessions.

### On EVERY session start:
1. Read \`.citadel/vault/PROGRESS.md\` — know where the project is
2. Read \`.citadel/vault/CONTEXT_SNAPSHOT.md\` — resume from last session
3. Read \`.citadel/vault/DECISIONS.md\` — don't contradict past decisions

### On EVERY phase transition or significant action:
1. Update \`.citadel/vault/PROGRESS.md\` — current phase, gate, what's done, what's next
2. Update \`.citadel/vault/SESSION_LOG.md\` — append what was done, by which agent, when
3. Update \`.citadel/vault/DECISIONS.md\` — append any architecture, tech, or product decision

### On EVERY session end (or when the user says "stop", "bye", "save"):
1. Write \`.citadel/vault/CONTEXT_SNAPSHOT.md\` — summary of current state, enough for the next session to resume without re-reading everything

### When code is written or modified:
1. Update \`.citadel/vault/CODE_INVENTORY.md\` — what files exist, what they do, key patterns

### Vault files:

| File | Purpose | When to read | When to write |
|------|---------|-------------|---------------|
| \`PROGRESS.md\` | Phase, gate, what's done/pending | Session start | Every phase change |
| \`CONTEXT_SNAPSHOT.md\` | Resume context for next session | Session start | Session end |
| \`SESSION_LOG.md\` | What happened, who did what | Never (it's a log) | After every action |
| \`DECISIONS.md\` | Architecture + product decisions | Session start | When decisions are made |
| \`CODE_INVENTORY.md\` | Files map, patterns, dependencies | When building/reviewing | When code changes |
| \`ARCHITECTURE.md\` | System design, tech stack, ADRs | When building | After architecture decisions |

⚠️ If these files are empty or missing, you are in a FRESH PROJECT. Start from Phase 1: Inception.
⚠️ If PROGRESS.md shows you're in Build phase, do NOT re-ask inception questions.

## COMMANDS
- "help" / "stuck" → Show status + next steps
- "status" → Read PROGRESS.md, show gate progress
- "build [feature]" → Start build
- "review" → Run checkers
- "snapshot" / "save" → Write CONTEXT_SNAPSHOT.md
- "@[agent]" → Talk to specific agent

## SPECS
- \`.citadel/specs/prd.md\` — Product requirements
- \`.citadel/specs/adr.md\` — Architecture decisions
- \`.citadel/specs/security.md\` — Security
- \`.citadel/specs/data-model.md\` — Data model
- \`.citadel/specs/growth.md\` — Growth
`;
}
// ── Write team files (phased loading) ──
function writeTeamFiles(citadelPath) {
    const teamsDir = join(citadelPath, 'teams');
    mkdirSync(teamsDir, { recursive: true });
    const all = [...AGENT_REGISTRY.values()];
    // C-Suite (loaded at inception)
    writeFileSync(join(teamsDir, 'c-suite.md'), buildTeamFile('C-Suite — Strategic Leadership', all.filter(a => a.level === 'c-suite')), 'utf-8');
    // CTO Makers (loaded at build)
    writeFileSync(join(teamsDir, 'cto-makers.md'), buildTeamFile('CTO Team — Makers', all.filter(a => a.team === 'cto' && a.level === 'maker')), 'utf-8');
    // CTO Checkers (loaded at review)
    writeFileSync(join(teamsDir, 'cto-checkers.md'), buildTeamFile('CTO Team — Checkers', all.filter(a => a.team === 'cto' && a.level === 'checker')), 'utf-8');
    // CPO Makers
    writeFileSync(join(teamsDir, 'cpo-makers.md'), buildTeamFile('CPO Team — Makers', all.filter(a => a.team === 'cpo' && a.level === 'maker')), 'utf-8');
    // CPO Checkers
    writeFileSync(join(teamsDir, 'cpo-checkers.md'), buildTeamFile('CPO Team — Checkers', all.filter(a => a.team === 'cpo' && a.level === 'checker')), 'utf-8');
    // CGO Makers
    writeFileSync(join(teamsDir, 'cgo-makers.md'), buildTeamFile('CGO Team — Makers', all.filter(a => a.team === 'cgo' && a.level === 'maker')), 'utf-8');
    // CGO Checkers
    writeFileSync(join(teamsDir, 'cgo-checkers.md'), buildTeamFile('CGO Team — Checkers', all.filter(a => a.team === 'cgo' && a.level === 'checker')), 'utf-8');
    // CISO All (loaded for security review)
    writeFileSync(join(teamsDir, 'ciso-all.md'), buildTeamFile('CISO Team — Security (Makers + Checkers)', all.filter(a => a.team === 'ciso')), 'utf-8');
    // CDO Makers
    writeFileSync(join(teamsDir, 'cdo-makers.md'), buildTeamFile('CDO Team — Makers', all.filter(a => a.team === 'cdo' && a.level === 'maker')), 'utf-8');
    // CDO Checkers
    writeFileSync(join(teamsDir, 'cdo-checkers.md'), buildTeamFile('CDO Team — Checkers', all.filter(a => a.team === 'cdo' && a.level === 'checker')), 'utf-8');
}
// ── Install for each IDE ──
export function installClaudeCode(projectPath) {
    writeFileSync(join(projectPath, 'CLAUDE.md'), buildRulesContent(), 'utf-8');
    const cmdDir = join(projectPath, '.claude', 'commands');
    mkdirSync(cmdDir, { recursive: true });
    writeFileSync(join(cmdDir, 'citadel-help.md'), `You are ATLAS. Read CLAUDE.md for rules. Show current phase, progress, next steps. Guide the user.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-build.md'), `Read CLAUDE.md for rules. Read ONLY the team file for the current phase (see PHASED CONTEXT LOADING table). Build following Maker→Checker flow.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-review.md'), `Read the relevant checker team file. Review: code quality, tests (80%+), performance, security (OWASP), accessibility (WCAG). PASS/FAIL per category.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-security.md'), `You are BRUCE (CISO). Read .citadel/teams/ciso-all.md. Full security audit. You have ABSOLUTE VETO POWER.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-status.md'), `Read .citadel/memory/session.json and .citadel/gates/. Show phase, gate progress, next steps.`, 'utf-8');
}
export function installCursor(projectPath) {
    writeFileSync(join(projectPath, '.cursorrules'), buildRulesContent(), 'utf-8');
    const cmdDir = join(projectPath, '.cursor', 'commands');
    mkdirSync(cmdDir, { recursive: true });
    writeFileSync(join(cmdDir, 'citadel-help.md'), `Read .cursorrules and .citadel/ directory. Show current phase, next steps.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-build.md'), `Read .cursorrules. Load ONLY the team file for the current phase. Build following Maker→Checker flow.`, 'utf-8');
    writeFileSync(join(cmdDir, 'citadel-review.md'), `Read relevant checker team file. PASS/FAIL per category.`, 'utf-8');
}
export function installAntigravity(projectPath) {
    writeFileSync(join(projectPath, 'GEMINI.md'), buildRulesContent(), 'utf-8');
    const agDir = join(projectPath, '.antigravity');
    mkdirSync(agDir, { recursive: true });
    writeFileSync(join(agDir, 'rules.md'), buildRulesContent(), 'utf-8');
}
export function installWindsurf(projectPath) {
    writeFileSync(join(projectPath, '.windsurfrules'), buildRulesContent(), 'utf-8');
}
export function installAllIDEs(projectPath) {
    installClaudeCode(projectPath);
    installCursor(projectPath);
    installAntigravity(projectPath);
    installWindsurf(projectPath);
}
export { writeTeamFiles };
//# sourceMappingURL=ide-rules.js.map