import { existsSync, mkdirSync, writeFileSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Memory } from '../core/memory.js';
import { GateSystem } from '../core/gates.js';
import { getAgentCount, AGENT_REGISTRY } from '../agents/registry.js';
import { banner } from '../ui/terminal.js';
import { installAllIDEs, TEAM_FILE_COUNT, writeTeamFiles } from './ide-rules.js';
import { SKILL_FILE_COUNT, writeSkills } from './skills.js';
import { AGENTS_DIR, GATES_DIR, HUB_FILE_COUNT, HUB_FILES, INTERNAL_DIR, PROJECT_HUB_DIR, PROJECT_SPECS_DIR, SKILLS_DIR, STATE_DIR, TEAMS_DIR, } from '../core/project-layout.js';
function writeTextFile(path, content, overwrite = true) {
    if (!overwrite && existsSync(path))
        return;
    writeFileSync(path, content, 'utf-8');
}
function ask(q) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(r => { rl.question(q, a => { rl.close(); r(a.trim()); }); });
}
export function writeAgentPersonas(cp) {
    const d = join(cp, 'agents');
    mkdirSync(d, { recursive: true });
    for (const [id, a] of AGENT_REGISTRY) {
        writeTextFile(join(d, `${id}.md`), [
            `# ${a.icon} ${a.name} — ${a.title}`,
            `> ${a.subtitle}`,
            '',
            `**Inspiration:** ${a.inspiration}`,
            `**Philosophy:** "${a.philosophy}"`,
            `**Level:** ${a.level} | **Team:** ${a.team}`,
            '',
            `## Personality`,
            a.personality,
            '',
            `## Voice`,
            a.voice,
            '',
            `## Rules (Immutable)`,
            ...a.rules.map(r => `- ${r}`),
            '',
            `## Principles`,
            ...a.principles.map(p => `- ${p}`),
            '',
            `## System Prompt`,
            a.systemPrompt,
        ].join('\n') + '\n');
    }
}
export function writeSpecTemplates(projectPath, overwrite = true) {
    const d = join(projectPath, PROJECT_SPECS_DIR);
    mkdirSync(d, { recursive: true });
    writeTextFile(join(d, 'prd.md'), '# Product Requirements Document\n\n## Problem Statement\n<!-- What problem are we solving? -->\n\n## Target Users\n\n## Success Metrics\n\n## User Stories\n<!-- As a [user], I want [action] so that [outcome] -->\n\n## Scope\n### In Scope\n### Out of Scope\n', overwrite);
    writeTextFile(join(d, 'adr.md'), '# Architecture Decision Records\n\n<!-- ADRs appended by LINUS (CTO) -->\n', overwrite);
    writeTextFile(join(d, 'implementation-plan.md'), '# Implementation Plan\n\n## Goal\n## Scope\n## Touch Points\n## Invariants\n## Risks\n## Verification\n## Rollback\n## Open Questions\n\n<!-- Owned by LINUS before makers start -->\n', overwrite);
    writeTextFile(join(d, 'security.md'), '# Security Requirements\n\n## Authentication\n## Authorization\n## Data Protection\n## Compliance\n## Threat Model\n\n<!-- Reviewed by BRUCE (CISO) — ABSOLUTE VETO POWER -->\n', overwrite);
    writeTextFile(join(d, 'data-model.md'), '# Data Model\n\n## Entities\n## Relationships\n## Indexes\n## Migration Plan\n\n<!-- Designed by CODD, reviewed by DATE -->\n', overwrite);
    writeTextFile(join(d, 'growth.md'), '# Growth Strategy\n\n## Metrics & KPIs\n## Analytics Plan\n## SEO Strategy\n## Growth Loops\n\n<!-- Owned by SEAN (CGO) -->\n', overwrite);
}
export function writeProjectHubTemplates(projectPath, overwrite = true) {
    const d = join(projectPath, PROJECT_HUB_DIR);
    mkdirSync(d, { recursive: true });
    writeTextFile(join(d, HUB_FILES.status), `# CITADEL Status

## Current State
- **Phase:** Inception (Gate 0)
- **Status:** Fresh project — no work started
- **Current mode:** Start

## Token Budget
- **Budget:** Light
- **Used:** 0 / 4,000 tokens (0%)
- **Status:** Healthy
- **Calls:** 0 | **Last response:** 0 | **Peak:** 0

## What Is Done
- CITADEL installed
- Project hub created

## What Happens Next
- Describe what you want to build
- Answer the planning questions
- Review the implementation plan
- Build, review, then ship

## Fast Modes
- **Start:** clarify the product, constraints, and priorities
- **Build:** implement an approved chunk safely
- **Fix:** patch a bug without breaking something else
- **Ship:** run final checks, deploy, and prepare rollback
`, overwrite);
    writeTextFile(join(d, HUB_FILES.context), `# CITADEL Context

## Last Updated
Never — fresh project.

## What We're Building
<!-- Not defined yet -->

## Current Focus
Project just initialized. Waiting for the user to describe the product.

## Open Questions
<!-- None yet -->
`, overwrite);
    writeTextFile(join(d, HUB_FILES.sessionLog), `# CITADEL Session Log

> Append-only. This is the readable history of what happened in the project.

---

### Session: Init
- **Date:** ${new Date().toISOString().split('T')[0]}
- **Agent:** ATLAS (Orchestrator)
- **Action:** Project initialized with CITADEL
- **Result:** Team, rules, skills, state, and project hub created

---
`, overwrite);
    writeTextFile(join(d, HUB_FILES.decisions), `# CITADEL Decisions

> Architecture, product, and implementation decisions live here.

---

<!-- New decisions will be appended here -->
`, overwrite);
    writeTextFile(join(d, HUB_FILES.codebase), `# CITADEL Codebase

> Human-readable map of the codebase, key patterns, and dependencies.

## Files
<!-- No code files mapped yet -->

## Patterns
<!-- No patterns documented yet -->

## Dependencies
<!-- No dependencies documented yet -->
`, overwrite);
    writeTextFile(join(d, HUB_FILES.architecture), `# CITADEL Architecture

## Tech Stack
<!-- Not decided yet -->

## System Design
<!-- Not decided yet -->

## Critical Flows
<!-- Not decided yet -->

## Constraints
<!-- Not decided yet -->
`, overwrite);
    writeTextFile(join(d, HUB_FILES.tokens), `# CITADEL Tokens

## Session Budget
- **Budget:** Light
- **Limit:** 4,000 tokens
- **Used:** 0 tokens
- **Status:** Healthy

## Session Metrics
- **LLM calls:** 0
- **Last response:** 0 tokens
- **Peak response:** 0 tokens

## Guidance
- Stay light until the task clearly needs more context.
- If usage spikes early, snapshot and start a smaller session.
`, overwrite);
    writeTextFile(join(d, HUB_FILES.runbook), `# CITADEL Runbook

## Run
<!-- How to run the project locally -->

## Deploy
<!-- How to ship safely -->

## Rollback
<!-- How to recover if release fails -->

## Monitoring
<!-- What to watch after deploy -->
`, overwrite);
    writeTextFile(join(d, HUB_FILES.changelog), `# CITADEL Changelog

## Unreleased
- Project initialized
`, overwrite);
    writeTextFile(join(d, HUB_FILES.handoff), `# CITADEL Handoff

## What This Project Is
<!-- Short project summary -->

## Current State
<!-- What is done and what is next -->

## Critical Things Not To Break
<!-- Add protected flows and invariants here -->

## How To Continue
<!-- Instructions for the next collaborator or next session -->
`, overwrite);
}
export function writeGettingStarted(projectPath, overwrite = true) {
    const d = join(projectPath, PROJECT_HUB_DIR);
    mkdirSync(d, { recursive: true });
    writeTextFile(join(d, HUB_FILES.gettingStarted), `# Getting Started with CITADEL

## What just happened?

\`npx citadel-ai init\` installed CITADEL into your project.

### Hidden engine
- \`${INTERNAL_DIR}/agents/\` — full agent personas
- \`${TEAMS_DIR}/\` — team files and delivery pods
- \`${SKILLS_DIR}/\` — skills and rules
- \`${STATE_DIR}/\` — internal runtime state
- \`${GATES_DIR}/\` — gate tracking

### Visible project hub
- \`${PROJECT_HUB_DIR}/STATUS.md\`
- \`${PROJECT_HUB_DIR}/CONTEXT.md\`
- \`${PROJECT_HUB_DIR}/SESSION_LOG.md\`
- \`${PROJECT_HUB_DIR}/DECISIONS.md\`
- \`${PROJECT_HUB_DIR}/ARCHITECTURE.md\`
- \`${PROJECT_HUB_DIR}/CODEBASE.md\`
- \`${PROJECT_HUB_DIR}/TOKENS.md\`
- \`${PROJECT_HUB_DIR}/RUNBOOK.md\`
- \`${PROJECT_HUB_DIR}/CHANGELOG.md\`
- \`${PROJECT_HUB_DIR}/HANDOFF.md\`
- \`${PROJECT_SPECS_DIR}/\`

## What to do now

1. Open your project in Codex, Claude Code, Cursor, Antigravity, or Windsurf
2. Describe what you want to build
3. Let CITADEL clarify the scope and risks
4. Review the implementation plan
5. Choose the right mode: Start, Build, Fix, or Ship

## If the AI goes off track

Tell it:

\`Follow CITADEL. Ask questions first, make a plan, protect what must not break, then build, review, and ship safely.\`
`, overwrite);
}
export async function initCommand(targetPath) {
    const pp = targetPath ?? process.cwd();
    const cp = join(pp, INTERNAL_DIR);
    console.log(banner());
    if (existsSync(cp)) {
        const redo = await ask('⚠️  Already initialized. Reinstall? (y/N): ');
        if (redo.toLowerCase() !== 'y') {
            console.log('\n👍 Keeping existing installation.\n');
            return;
        }
    }
    console.log('\n⏳ Installing CITADEL...\n');
    for (const d of [
        cp,
        join(pp, STATE_DIR),
        join(pp, GATES_DIR),
        join(pp, AGENTS_DIR),
        join(pp, TEAMS_DIR),
        join(pp, SKILLS_DIR),
        join(pp, PROJECT_HUB_DIR),
        join(pp, PROJECT_SPECS_DIR),
    ]) {
        mkdirSync(d, { recursive: true });
    }
    writeFileSync(join(cp, 'citadel.config.json'), JSON.stringify({
        version: '11.0.0',
        features: { autoGates: true, persistentMemory: true, chineseWalls: true },
    }, null, 2), 'utf-8');
    const memory = new Memory(pp);
    memory.initSession();
    new GateSystem(pp).initAllGates();
    writeAgentPersonas(cp);
    writeTeamFiles(cp);
    writeSkills(cp);
    writeSpecTemplates(pp);
    writeProjectHubTemplates(pp);
    writeGettingStarted(pp);
    memory.refreshProjectHub();
    installAllIDEs(pp);
    const gi = join(pp, '.gitignore');
    const requiredIgnores = ['.citadel/state/', '.citadel/gates/'];
    if (existsSync(gi)) {
        const current = readFileSync(gi, 'utf-8');
        const missing = requiredIgnores.filter(line => !current.includes(line));
        if (missing.length)
            appendFileSync(gi, `\n# CITADEL internal state\n${missing.join('\n')}\n`);
    }
    else {
        writeFileSync(gi, `# CITADEL internal state\n${requiredIgnores.join('\n')}\n`);
    }
    const c = getAgentCount();
    console.log(`  ✅ ${c.total} agents installed (${AGENTS_DIR}/)
  ✅ ${TEAM_FILE_COUNT} team files for phased loading (${TEAMS_DIR}/)
  ✅ ${SKILL_FILE_COUNT} skills files — engineering standards (${SKILLS_DIR}/)
  ✅ Spec templates (${PROJECT_SPECS_DIR}/)
  ✅ ${HUB_FILE_COUNT} visible project hub files (${PROJECT_HUB_DIR}/)
  ✅ Internal state + gates (${STATE_DIR}/, ${GATES_DIR}/)

  IDE rules (auto-loaded — no config needed):
  ✅ AGENTS.md         → Codex
  ✅ CLAUDE.md         → Claude Code
  ✅ .cursorrules      → Cursor
  ✅ GEMINI.md         → Antigravity
  ✅ .windsurfrules    → Windsurf

  Slash commands:
  ✅ /citadel-start    → clarify + plan before code
  ✅ /citadel-help     → what to do next
  ✅ /citadel-build    → build with planning + review
  ✅ /citadel-fix      → hotfix + change-impact review
  ✅ /citadel-review   → checker + CTO coherence review
  ✅ /citadel-ship     → release readiness + rollback
  ✅ /citadel-estimate → estimate context pressure before execution
  ✅ /citadel-snapshot → save context + handoff
  ✅ /citadel-security → security audit
  ✅ /citadel-status   → phase + gate + token budget

${'═'.repeat(56)}

  ✅ CITADEL is ready.

  1. Open this folder in your AI IDE
  2. Start by describing what you want to build
  3. Review the plan before any code

  Visible project hub:
  📖 ${PROJECT_HUB_DIR}/${HUB_FILES.gettingStarted}
  📌 ${PROJECT_HUB_DIR}/${HUB_FILES.status}
  🧠 ${PROJECT_HUB_DIR}/${HUB_FILES.context}
  🧮 ${PROJECT_HUB_DIR}/${HUB_FILES.tokens}
`);
}
//# sourceMappingURL=init.js.map