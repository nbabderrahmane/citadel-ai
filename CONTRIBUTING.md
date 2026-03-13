# Contributing to CITADEL

First off, thanks for wanting to contribute! CITADEL is built for vibe coders — people who build with AI. You don't need to be a traditional developer to help.

## How to Contribute

### Reporting Bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your Node.js version (`node --version`)
- Your OS

### Suggesting Agents

Want a new agent in CITADEL? Open an issue with:
- **Agent name & role** — What does it do?
- **Inspiration** — Which legendary dev/designer/thinker inspires it?
- **Philosophy** — One line that captures its worldview
- **Team** — Which C-suite does it report to? (CTO, CPO, CGO, CISO, CDO)
- **Level** — Maker or Checker?
- **Rules** — 3-5 immutable rules it follows

### Submitting Code

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run the build: `npm run build`
5. Test it: `node dist/cli/index.js agents` (should show 42 agents)
6. Commit: `git commit -m "feat: description"`
7. Push: `git push origin feat/your-feature`
8. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature or agent
- `fix:` — Bug fix
- `docs:` — Documentation only
- `refactor:` — Code change that doesn't add features or fix bugs
- `test:` — Adding tests
- `chore:` — Maintenance, deps, CI

### Code Standards

CITADEL enforces its own standards:

- TypeScript strict mode
- Max 200 lines per file
- Max 30 lines per function
- Meaningful names — no abbreviations
- Every public function should be documented

### Project Structure

```
src/
├── agents/registry.ts    # All 42 agent definitions
├── core/
│   ├── orchestrator.ts   # ATLAS brain
│   ├── memory.ts         # Persistent memory
│   ├── gates.ts          # Quality gates
│   ├── loops.ts          # Iteration loops
│   ├── chinese-wall.ts   # Maker ≠ Checker
│   └── types.ts          # TypeScript types
├── llm/provider.ts       # LLM abstraction
├── ui/terminal.ts        # CLI interface
└── cli/                  # CLI commands
```

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/citadel-ai.git
cd citadel-ai
npm install
npm run build
node dist/cli/index.js agents  # Should list 42 agents
```

## Questions?

Open a Discussion or Issue. No question is too basic.

---

Built with 🏰 by humans who talk to machines.
