import { existsSync, mkdirSync, writeFileSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Memory } from '../core/memory.js';
import { GateSystem } from '../core/gates.js';
import { getAgentCount, AGENT_REGISTRY } from '../agents/registry.js';
import { banner } from '../ui/terminal.js';
import { installAllIDEs, writeTeamFiles } from './ide-rules.js';
import { writeSkills } from './skills.js';

function ask(q: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => { rl.question(q, a => { rl.close(); r(a.trim()); }); });
}

function writeAgentPersonas(cp: string): void {
  const d = join(cp, 'agents');
  mkdirSync(d, { recursive: true });
  for (const [id, a] of AGENT_REGISTRY) {
    writeFileSync(join(d, `${id}.md`), [
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
    ].join('\n') + '\n', 'utf-8');
  }
}

function writeSpecTemplates(cp: string): void {
  const d = join(cp, 'specs');
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, 'prd.md'), '# Product Requirements Document\n\n## Problem Statement\n<!-- What problem are we solving? -->\n\n## Target Users\n\n## Success Metrics\n\n## User Stories\n<!-- As a [user], I want [action] so that [outcome] -->\n\n## Scope\n### In Scope\n### Out of Scope\n', 'utf-8');
  writeFileSync(join(d, 'adr.md'), '# Architecture Decision Records\n\n<!-- ADRs appended by LINUS (CTO) -->\n', 'utf-8');
  writeFileSync(join(d, 'security.md'), '# Security Requirements\n\n## Authentication\n## Authorization\n## Data Protection\n## Compliance\n## Threat Model\n\n<!-- Reviewed by BRUCE (CISO) — ABSOLUTE VETO POWER -->\n', 'utf-8');
  writeFileSync(join(d, 'data-model.md'), '# Data Model\n\n## Entities\n## Relationships\n## Indexes\n## Migration Plan\n\n<!-- Designed by CODD, reviewed by DATE -->\n', 'utf-8');
  writeFileSync(join(d, 'growth.md'), '# Growth Strategy\n\n## Metrics & KPIs\n## Analytics Plan\n## SEO Strategy\n## Growth Loops\n\n<!-- Owned by SEAN (CGO) -->\n', 'utf-8');
}

function writeVaultTemplates(cp: string): void {
  const d = join(cp, 'vault');
  mkdirSync(d, { recursive: true });

  writeFileSync(join(d, 'PROGRESS.md'), `# Project Progress

## Current State
- **Phase:** Inception (Gate 0)
- **Status:** Fresh project — no work started
- **Active agents:** None yet

## Gates
| Gate | Status | Notes |
|------|--------|-------|
| Gate 0 — Inception | ⬜ Pending | C-Suite needs to ask questions |
| Gate 1 — Pre-Design | ⬜ Pending | |
| Gate 2 — Pre-Build | ⬜ Pending | |
| Gate 3 — Pre-Ship | ⬜ Pending | |
| Gate 4 — Post-Deploy | ⬜ Pending | |

## Done
<!-- Nothing yet -->

## Next
- [ ] User describes what they want to build
- [ ] C-Suite asks questions
- [ ] Specs drafted after user answers
`, 'utf-8');

  writeFileSync(join(d, 'CONTEXT_SNAPSHOT.md'), `# Context Snapshot

> This file is written at the end of each session. Read it first to resume.

## Last Updated
Never — fresh project.

## What We're Building
<!-- Not defined yet -->

## Key Decisions Made
<!-- None yet -->

## Where We Left Off
Project just initialized. Waiting for user to describe what they want to build.

## Open Questions
<!-- None yet -->
`, 'utf-8');

  writeFileSync(join(d, 'SESSION_LOG.md'), `# Session Log

> Append-only. Every significant action is logged here.

---

### Session: Init
- **Date:** ${new Date().toISOString().split('T')[0]}
- **Agent:** ATLAS (Orchestrator)
- **Action:** Project initialized with CITADEL
- **Result:** 42 agents installed, specs templates created, vault ready

---

<!-- New sessions are appended below -->
`, 'utf-8');

  writeFileSync(join(d, 'DECISIONS.md'), `# Decisions Log

> Every architecture, product, or tech decision is recorded here.
> Format: Decision — Reason — Alternatives considered — Date — Agent

---

<!-- Decisions will be appended by C-Suite agents -->
`, 'utf-8');

  writeFileSync(join(d, 'CODE_INVENTORY.md'), `# Code Inventory

> Map of all project files, what they do, and key patterns.
> Updated by maker agents when code is written or modified.

## Files
<!-- No code files yet -->

## Key Patterns
<!-- No patterns established yet -->

## Dependencies
<!-- No dependencies yet -->
`, 'utf-8');

  writeFileSync(join(d, 'ARCHITECTURE.md'), `# Architecture

> System design, tech stack decisions, and high-level structure.
> Updated by LINUS (CTO) and CODD (Data Architect).

## Tech Stack
<!-- Not decided yet -->

## System Design
<!-- Not decided yet -->

## Data Model Summary
<!-- Not decided yet -->

## API Design
<!-- Not decided yet -->
`, 'utf-8');
}

function writeGettingStarted(pp: string): void {
  writeFileSync(join(pp, '.citadel', 'GETTING_STARTED.md'), `# 🏰 Getting Started with CITADEL

## What just happened?

\`npx citadel-ai init\` installed CITADEL into your project. Here's what it created:

### Files your IDE reads automatically
Your AI IDE picks these up without any action from you:
- \`CLAUDE.md\` → Claude Code reads this on every message
- \`GEMINI.md\` → Antigravity reads this on every message
- \`.cursorrules\` → Cursor reads this on every message
- \`.windsurfrules\` → Windsurf reads this on every message

These files contain the CITADEL rules: which agents exist, how they work together,
when to ask questions vs when to build, and what standards to enforce.

### Your project's knowledge base (.citadel/)
- \`agents/\` — 42 agent personas with full personality, rules, and system prompts
- \`teams/\` — Same agents grouped by team (loaded per phase to save tokens)
- \`specs/\` — Templates for PRD, architecture, security, data model, growth
- \`memory/\` — Session state, decisions, errors (persists across sessions)
- \`gates/\` — Progress tracking for the 5 quality gates

### Slash commands (Claude Code & Cursor)
- \`/citadel-help\` — "What should I do next?"
- \`/citadel-build\` — Start building with the maker team
- \`/citadel-review\` — Run the checker team on your code
- \`/citadel-security\` — Full security audit by BRUCE (CISO)
- \`/citadel-status\` — See current phase and gate progress

## What to do now

### Step 1: Open your project in your IDE
Just open this folder in Claude Code, Cursor, Antigravity, or Windsurf.
The AI already knows about CITADEL — no configuration needed.

### Step 2: Describe what you want to build
Type something like:
- "I want to build a meal planning app for people with food allergies"
- "I need an internal dashboard to track team capacity"
- "Build me a REST API for a marketplace"

### Step 3: Answer the C-Suite's questions
The AI will convene the C-Suite — 5 strategic agents who each ask
1-2 questions from their angle:
- 🎯 MARTY (Product): Who is this for? What problem?
- 🏗️ LINUS (Architecture): Tech preferences? Scale?
- 🛡️ BRUCE (Security): User data? Auth needs?
- 📈 SEAN (Growth): How will users find this?
- 🗄️ MONICA (Data): What entities? Relationships?

Answer their questions. They'll draft specs based on YOUR answers.

### Step 4: Build
The maker agents will build per domain — backend, frontend, mobile, etc.
Each one follows strict code standards.

### Step 5: Review
Checker agents validate independently. The builder never reviews their own work.

## Tips

- Say "help" or "stuck" anytime — ATLAS will guide you
- Say "@bruce" to talk directly to the security agent
- Say "status" to see gate progress
- Specs are saved in .citadel/specs/ — they persist across sessions
- If the AI starts building without asking questions first, remind it:
  "Follow CITADEL rules — ask questions before drafting"

## Need help?
https://github.com/nbabderrahmane/citadel-ai/issues
`, 'utf-8');
}

// ═══ MAIN INIT ═══
export async function initCommand(targetPath?: string): Promise<void> {
  const pp = targetPath ?? process.cwd();
  const cp = join(pp, '.citadel');

  console.log(banner());

  if (existsSync(cp)) {
    const redo = await ask('⚠️  Already initialized. Reinstall? (y/N): ');
    if (redo.toLowerCase() !== 'y') { console.log('\n👍 Keeping existing installation.\n'); return; }
  }

  console.log('\n⏳ Installing CITADEL...\n');

  // Scaffold
  for (const d of [cp, join(cp, 'memory'), join(cp, 'gates'), join(cp, 'specs'), join(cp, 'agents'), join(cp, 'teams'), join(cp, 'vault'), join(cp, 'skills')]) {
    mkdirSync(d, { recursive: true });
  }

  // Config
  writeFileSync(join(cp, 'citadel.config.json'), JSON.stringify({
    version: '10.3.0',
    features: { autoGates: true, persistentMemory: true, chineseWalls: true },
  }, null, 2), 'utf-8');

  // Init memory & gates
  new Memory(pp).initSession();
  new GateSystem(pp).initAllGates();

  // Content
  writeAgentPersonas(cp);
  writeTeamFiles(cp);
  writeSkills(cp);
  writeSpecTemplates(cp);
  writeVaultTemplates(cp);
  writeGettingStarted(pp);

  // IDE rules
  installAllIDEs(pp);

  // .gitignore (vault is committed, memory/gates are not)
  const gi = join(pp, '.gitignore');
  const giContent = '\n# CITADEL state (vault + specs + agents are committed)\n.citadel/memory/\n.citadel/gates/\n';
  if (existsSync(gi)) {
    if (!readFileSync(gi, 'utf-8').includes('.citadel/memory')) appendFileSync(gi, giContent);
  } else {
    writeFileSync(gi, giContent);
  }

  const c = getAgentCount();
  console.log(`  ✅ ${c.total} agents installed (.citadel/agents/)
  ✅ 10 team files for phased loading (.citadel/teams/)
  ✅ 7 skills files — engineering standards (.citadel/skills/)
  ✅ Spec templates (.citadel/specs/)
  ✅ Project vault — live memory (.citadel/vault/)
  ✅ Getting started guide (.citadel/GETTING_STARTED.md)

  IDE rules (auto-loaded — no config needed):
  ✅ CLAUDE.md         → Claude Code
  ✅ .cursorrules      → Cursor
  ✅ GEMINI.md         → Antigravity
  ✅ .windsurfrules    → Windsurf

  Slash commands:
  ✅ /citadel-help     → "What do I do next?"
  ✅ /citadel-build    → Start the maker team
  ✅ /citadel-review   → Run the checker team
  ✅ /citadel-security → Security audit
  ✅ /citadel-status   → Phase & gate progress

${'═'.repeat(56)}

  ✅ CITADEL is ready. Here's what to do:

  1. Open this folder in your IDE
     (Claude Code, Cursor, Antigravity, or Windsurf)

  2. The AI already knows the rules — just start talking:
     "I want to build [describe your idea]"

  3. The C-Suite will ask you questions FIRST,
     then draft specs based on your answers.

  That's it. You talk, the team works.

  📖 Full guide: .citadel/GETTING_STARTED.md
`);
}
