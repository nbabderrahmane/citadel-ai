# 🏰 Getting Started with CITADEL

## Choose your path

### Path A: I know what a terminal is

```bash
cd my-project
npx citadel-ai init
```

Done. Open your IDE and type `/citadel-help` or just start chatting.

---

### Path B: I've never used a terminal (recommended for most vibe coders)

**Step 1: Open your AI IDE**

Open Codex, Cursor, Antigravity, Claude Code, or Windsurf — whichever you use to vibecode.

**Step 2: Open or create your project folder**

If you already have a project, open it. If not, create an empty folder on your computer (call it whatever you want — "my-app", "side-project", anything).

**Step 3: Find the terminal inside your IDE**

Every AI IDE has a built-in terminal. You don't need to open a separate app.

- **Cursor**: Menu → Terminal → New Terminal (or press `` Ctrl+` ``)
- **Antigravity**: Click the terminal icon at the bottom, or press `` Ctrl+` ``
- **Claude Code**: Claude Code IS a terminal — just type directly
- **Windsurf**: Menu → Terminal → New Terminal (or press `` Ctrl+` ``)
- **VS Code**: Menu → Terminal → New Terminal (or press `` Ctrl+` ``)

You'll see a text area at the bottom of your screen with a blinking cursor. That's the terminal.

**Step 4: Type this command and press Enter**

```
npx citadel-ai init
```

That's it. One command. It will:
- Download CITADEL (takes a few seconds)
- Create all the files your AI needs
- Set up rules for your specific IDE

You'll see something like:

```
✅ CITADEL installed! 42 agents ready.

  AGENTS.md   Codex rules (lean, phased loading)
  citadel/
  ├── STATUS.md
  ├── CONTEXT.md
  ├── DECISIONS.md
  ├── ARCHITECTURE.md
  ├── TOKENS.md
  ├── RUNBOOK.md
  ├── HANDOFF.md
  └── specs/
  .citadel/
  ├── state/   Session state (gitignored)
  ├── gates/   Gate progress (gitignored)
  ├── teams/   Delivery pods
  └── skills/  Rules and specialist skills
```

**Step 5: Start chatting**

Go back to your AI chat and say what you want to build. The AI already knows about CITADEL — it will start by asking you questions before building anything.

That's the whole setup. You're done.

---

### Path C: I don't want to touch the terminal at all

Copy-paste this message into your AI chat:

```
I want to set up CITADEL in this project. 
Please run this command in the terminal: npx citadel-ai init
Then read the AGENTS.md, CLAUDE.md, or GEMINI.md file that was created and follow its instructions.
```

Your AI IDE will run the command for you and set everything up.

---

## What happens after install

Your AI now works like a team of 42 specialists instead of one generalist brain.

When you describe what you want to build:

1. **The C-Suite asks questions first** — product, architecture, security, data, growth. You answer.
2. **Then specs get drafted** — PRD, architecture decisions, security requirements. Saved in `citadel/specs/`.
3. **Makers build** — specialized agents write code per domain (backend, frontend, mobile, etc.)
4. **Checkers review** — independent agents validate the work (the builder never reviews their own code)
5. **Security has veto power** — nothing ships without a security check
6. **Token budget stays visible** — you can check `citadel/TOKENS.md` or `status` before a session gets too expensive

## Useful commands (in the chat)

You can say these things to your AI at any time:

| What you say | What happens |
|-------------|-------------|
| "help" or "I'm stuck" | ATLAS explains where you are and what to do next |
| "status" | Shows phase, gate, and token budget |
| "estimate login flow" | Estimates context pressure before the next heavy task |
| "start" | Runs the clarification and planning flow |
| "build [feature]" | Starts the build with the right maker agents |
| "fix [bug]" | Runs the hotfix flow with change-impact review |
| "review" | Runs the checker team on your code |
| "ship" | Runs release readiness and rollback checks |
| "@bruce security check" | Asks the CISO to audit security |
| Any description of what you want | ATLAS routes to the right expert |

## FAQ

**Do I need an API key?**
Not for IDE usage. Your IDE already has its own AI. CITADEL just gives it structure.
The API key is only needed if you want to use the CLI (`npx citadel-ai run`), which most people don't need.

**Does this work with [my IDE]?**
If your IDE reads project files for context (most AI IDEs do), yes. CITADEL creates rule files for Codex, Claude Code, Cursor, Antigravity, and Windsurf automatically.

**Can I use this with an existing project?**
Yes. Run `npx citadel-ai init` in your project folder. It won't modify your existing code — it only adds CITADEL files.

**What if I want to remove CITADEL?**
Delete the `citadel/` and `.citadel/` folders plus the rule files (AGENTS.md, CLAUDE.md, GEMINI.md, .cursorrules, .windsurfrules). Your project code is untouched.

**Is this free?**
Yes. MIT license. Free forever.
