# CITADEL

Build with AI without ending up with a fragile app.

CITADEL is a lightweight governance layer for AI coding tools. It helps solo founders, PMs, and small teams turn ideas into solid MVPs by making the AI:

- ask the right questions first
- keep project memory between sessions
- separate building from reviewing
- check for risks before shipping
- show token budget before context spirals out of control

[![npm version](https://img.shields.io/npm/v/citadel-ai.svg)](https://www.npmjs.com/package/citadel-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Works with **Codex** · **Claude Code** · **Cursor** · **Antigravity** · **Windsurf**

## Who it's for

CITADEL is for:

- solo founders building with AI
- PMs turning ideas into internal tools or MVPs
- small teams without a full engineering org

CITADEL is not for:

- people looking for one-shot prompts
- teams that already have strong engineering process
- full enterprise delivery needs out of the box

## Why use it

Without structure, AI coding often looks great on day 1 and becomes painful on day 30.

Typical problems:

- the AI starts coding before the problem is clear
- it forgets decisions from earlier sessions
- it breaks working parts when adding new features
- nobody reviews the work independently
- the project becomes hard to maintain

CITADEL adds process around your AI so you can move fast without building a house of cards.

## What CITADEL does

After install, your AI will:

1. Ask questions before writing code
2. Write down the project plan and key decisions
3. Use specialist builder roles for implementation
4. Use separate checker roles for review
5. Keep project memory so the next session can resume properly

Under the hood, CITADEL uses a structured team model with strategy, makers, checkers, memory, and gates. You do not need to learn all of that to get value.

## 2-minute setup

In your project folder:

```bash
npx citadel-ai init
```

Then open your AI IDE and start chatting.

If your AI asks what to do next, tell it:

```text
Follow CITADEL. Ask questions first, make a plan, protect what must not break, then build, review, and ship safely.
```

## What gets installed

CITADEL adds:

- IDE rule files such as `AGENTS.md`, `CLAUDE.md`, `.cursorrules`
- a visible `citadel/` project hub for status, context, decisions, architecture, runbook, and handoff
- visible token telemetry in `citadel/TOKENS.md`
- a hidden `.citadel/` engine for internal state, gates, teams, agents, and skills

You do not need to configure anything manually in most cases.

## What happens next

Once installed, the flow is simple:

1. Describe what you want to build
2. Answer the AI's clarification questions
3. Review the plan
4. Let it build or fix the right chunk
5. Let it review before shipping

## Commands

```bash
npx citadel-ai init
npx citadel-ai update
npx citadel-ai run
npx citadel-ai status
npx citadel-ai estimate "login flow"
npx citadel-ai agents
```

In Claude Code or Cursor, you can also use:

- `/citadel-start`
- `/citadel-help`
- `/citadel-build`
- `/citadel-fix`
- `/citadel-review`
- `/citadel-ship`
- `/citadel-estimate`
- `/citadel-snapshot`
- `/citadel-status`

## If you've never used a terminal

See [GETTING-STARTED.md](GETTING-STARTED.md).

## Limits

- CITADEL improves how your AI works, but it does not replace judgment
- it is best for MVPs, internal tools, and early-stage products
- it is still evolving

## Why it is different

Most AI coding setups focus on generating more code.

CITADEL focuses on:

- better decisions before code
- better memory across sessions
- safer changes
- better review before shipping

## French

French version: [README.fr.md](README.fr.md)

## License

MIT
