# 🏰 CITADEL


CITADEL helps serious vibe coders build with structure, memory, and review — so their MVP doesn't collapse under hidden mistakes.

[![npm version](https://img.shields.io/npm/v/citadel-ai.svg)](https://www.npmjs.com/package/citadel-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```bash
npx citadel-ai init
```

Works with **Codex** · **Claude Code** · **Cursor** · **Antigravity** · **Windsurf**

---

## Is this for you?

### CITADEL is for

- Solo founders building their first MVP with AI
- Operators and PMs who vibecode internal tools
- Growth builders shipping fast without a dedicated dev team
- Non-traditional developers who want guardrails, not gatekeeping

### CITADEL is not for

- People looking for one-shot prompts
- Senior engineers who already have strong architecture discipline
- Teams that need a production-grade CI/CD platform
- Complete beginners who have never built anything with AI

---

## The problem

When you vibecode without structure:

- The AI skips architecture — it generates code that works today and breaks tomorrow
- Nobody reviews — the builder validates their own work (and misses their own mistakes)
- Context gets lost — the AI forgets what was decided 3 messages ago
- No standards — spaghetti code, magic numbers, business logic everywhere
- Security is an afterthought — auth, encryption, compliance happen "later" (never)

You end up with a prototype that demos well and crumbles under real use.

---

## What CITADEL does

CITADEL installs a governance layer into your AI IDE. It doesn't replace your AI — it makes it work like a disciplined team instead of a solo improviser.

**Forces strategic thinking first.** Before any code, a virtual C-Suite asks questions about your product, architecture, security, data, and growth. You answer. Then specs get drafted. Not the other way around.

**Separates building from reviewing.** The agent that writes code is never the one that reviews it. Like any serious engineering org.

**Enforces safety checks before shipping.** 5 mandatory gates from inception to deployment. Security has veto power — no exceptions.

**Keeps project memory across sessions.** A vault of markdown files that the AI reads on session start and updates as it works. Decisions, architecture, code inventory, progress — all persisted. The AI doesn't start from scratch every time.

**Loads only what's needed.** Instead of dumping 42 agent profiles into context (and burning your token quota), CITADEL loads only the team relevant to the current phase. 88% less tokens.

---

## Without CITADEL / With CITADEL

| | Without | With CITADEL |
|--|---------|-------------|
| Start | "Build me an app" → AI dives into code | C-Suite asks: who is this for? what data? what security? |
| Architecture | Whatever the AI decides in the moment | Explicit ADR, reviewed by a dedicated architecture agent |
| Code quality | Hope for the best | Standards enforced: 200 lines/file, typed errors, no magic numbers |
| Review | You read it yourself (and miss things) | Independent checker agents with different perspective |
| Security | "We'll add auth later" | Security review at every gate. Veto power on deployment |
| Next session | AI forgot everything | Vault files persist: decisions, progress, code inventory |
| Token usage | Full context every message (~14K tokens) | Phased loading (~1,800 tokens per phase) |

---

## How it works — 5 steps

### Step 1: Clarify what you're building
The C-Suite (product, architecture, security, data, growth) asks questions before anything gets drafted.

### Step 2: Lock the strategy
PRD, architecture decisions, security requirements, data model — all written to `.citadel/specs/` after your answers.

### Step 3: Build with role separation
Specialized maker agents build per domain (backend, frontend, mobile, API, auth, data). Each one follows strict code standards.

### Step 4: Review before shipping
Independent checker agents validate code quality, tests, performance, security, accessibility. Builder ≠ reviewer — always.

### Step 5: Ship with memory
Decisions, errors, and context persist in `.citadel/memory/`. Next session picks up where you left off.

---

## Quick Start

### Option 1: Copy-paste into your AI chat (easiest)

Open your AI IDE (Codex, Cursor, Antigravity, Claude Code, Windsurf) and paste this:

```
Run this command in the terminal: npx citadel-ai init
Then read the AGENTS.md, CLAUDE.md, or GEMINI.md file that was created and follow its instructions.
```

Your AI does the rest. Start describing what you want to build.

### Option 2: One command in the terminal

Open the terminal inside your IDE (press `` Ctrl+` `` in most IDEs) and type:

```bash
npx citadel-ai init
```

Then go back to your AI chat and start talking.

### Never used a terminal before?

See [GETTING-STARTED.md](GETTING-STARTED.md) — a step-by-step guide with zero assumptions.

This creates:

```
your-project/
├── AGENTS.md              ← Auto-loaded by Codex
├── CLAUDE.md              ← Auto-loaded by Claude Code
├── GEMINI.md              ← Auto-loaded by Antigravity
├── .cursorrules           ← Auto-loaded by Cursor
├── .windsurfrules         ← Auto-loaded by Windsurf
├── .claude/commands/      ← /citadel-help, /citadel-build, /citadel-review...
├── .cursor/commands/
├── .citadel/
│   ├── agents/            ← 42 full agent personas (reference)
│   ├── teams/             ← 12 team files and delivery pods (phased loading by IDE)
│   ├── vault/             ← Live project memory (AI reads + writes)
│   │   ├── PROGRESS.md        Phase, gates, what's done/next
│   │   ├── CONTEXT_SNAPSHOT.md Resume point for next session
│   │   ├── SESSION_LOG.md     What happened, who did what
│   │   ├── DECISIONS.md       Architecture + product decisions
│   │   ├── CODE_INVENTORY.md  File map, patterns, dependencies
│   │   └── ARCHITECTURE.md    System design, tech stack
│   ├── specs/             ← PRD, ADR, Security, Data Model, Growth
│   ├── memory/            ← Internal state (gitignored)
│   └── gates/             ← Gate tracking (gitignored)
```

Everything is installed. The IDE reads only what's contextual.

| IDE | How to start |
|-----|-------------|
| Claude Code | `/citadel-help` |
| Cursor | `/citadel-help` |
| Codex | Start chatting (`AGENTS.md` is loaded) |
| Antigravity | Just start chatting |
| Windsurf | Just start chatting |

Optional CLI (needs API key):
```bash
export ANTHROPIC_API_KEY=sk-ant-...  # or OPENAI_API_KEY
npx citadel-ai run
```

---

## Why it's different

Most AI frameworks give you **more agents**. CITADEL gives you **more discipline**.

- **Organization > single brain.** 42 agents with distinct roles, rules, and personalities — but loaded per phase, not all at once.
- **Governance > speed.** Questions before specs. Review before ship. Security veto before deploy.
- **Memory > amnesia.** A vault of markdown files the AI reads on session start and updates as it works. Progress, decisions, code inventory, architecture — all live.
- **Efficiency > brute force.** Phased context loading means ~1,800 tokens per phase instead of ~14,000.

---

## The 42 agents

Each agent has a full persona: name, inspiration, philosophy, voice, immutable rules, and system prompt. All stored in `.citadel/agents/`.

**Strategic (C-Suite):** ATLAS (Orchestrator) · LINUS (CTO) · MARTY (CPO) · SEAN (CGO) · BRUCE (CISO) · MONICA (CDO)

**Builders (Makers):** UNCLE BOB · DAN · STEIPETE · KELSEY · JONY · TERESA · STRUNK · DJ PATIL · CYRUS · CHAMATH · FILIPPO · MOXIE · MAX · CODD · KARPATHY · HARRISON · ALEX · GRACE · CHARITY · RICH

**Validators (Checkers):** GUIDO · KENT · BRENDAN · JAKOB · RAZOR · LISA · NATE · ALEYDA · PEEP · CHARLIE · WINDOW · DATE · DEMING · FLYWAY · AARON · TRAIL

`npx citadel-ai agents` lists them all with roles and teams.

---

## Known limitations

- **Early stage.** This is v1, actively developed. Expect rough edges.
- **Not autonomous.** CITADEL structures AI work — it doesn't run unsupervised.
- **Not a replacement for a real team.** Great for MVPs and internal tools. For scaling to production, you still need real developers and a CTO.
- **IDE-dependent.** The phased loading relies on how your IDE reads context files. Behavior varies.

---

## Roadmap

- [ ] Onboarding wizard (guided first 10 minutes)
- [ ] Demo video (60-second Loom)
- [ ] More IDE-specific optimizations
- [ ] Plugin system for custom agents
- [ ] Non-code use cases (growth teams, marketing, ops)

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `npx citadel-ai init` | Install CITADEL in your project |
| `npx citadel-ai update` | Update framework files (keeps your data) |
| `npx citadel-ai run` | Interactive CLI (needs API key) |
| `npx citadel-ai agents` | List all 42 agents |
| `npx citadel-ai status` | Current phase & gate |
| `npx citadel-ai help` | All commands |

---

## Contributing

CITADEL is built for people who build with AI without being traditional developers. If that's you, you're welcome here.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🇫🇷 Français

Ce README existe aussi en français → [README.fr.md](README.fr.md)

---

## License

MIT

---

Built with 🏰 by humans who talk to machines.
