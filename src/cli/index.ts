import { initCommand } from './init.js';
import { runCommand } from './run.js';
import { updateCommand } from './update.js';

const CURRENT_VERSION = '11.0.0';

function isVersionNewer(candidate: string, current: string): boolean {
  const parse = (value: string): number[] => value.split('.').map(part => Number.parseInt(part, 10) || 0);
  const left = parse(candidate);
  const right = parse(current);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i += 1) {
    const a = left[i] ?? 0;
    const b = right[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }

  return false;
}

// ── Background version check (non-blocking) ──
async function checkForUpdate(): Promise<void> {
  try {
    const res = await fetch('https://registry.npmjs.org/citadel-ai/latest', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return;
    const data = await res.json() as any;
    const latest = data.version;
    if (latest && isVersionNewer(latest, CURRENT_VERSION)) {
      console.log(`\n  ⬆️  New version available: ${latest} (current: ${CURRENT_VERSION})`);
      console.log(`     Run: npx citadel-ai update\n`);
    }
  } catch {
    // Silent fail — don't block the user
  }
}

const cmd = process.argv[2];
const cmdArgs = process.argv.slice(3);

if (cmd === 'init' || cmd === 'install') {
  initCommand().then(() => checkForUpdate()).catch(e => { console.error(e.message); process.exit(1); });
} else if (cmd === 'update' || cmd === 'upgrade') {
  updateCommand().catch(e => { console.error(e.message); process.exit(1); });
} else if (cmd === 'run' || !cmd) {
  runCommand().catch(e => { console.error(e.message); process.exit(1); });
} else if (cmd === 'agents') {
  checkForUpdate();
  import('../agents/registry.js').then(({ AGENT_REGISTRY }) => {
    console.log(`\n🏰 CITADEL — ${AGENT_REGISTRY.size} Agents\n`);
    const levels = ['command', 'c-suite', 'maker', 'checker'] as const;
    const labels: Record<string, string> = { command: '⚡ COMMAND', 'c-suite': '👔 C-SUITE', maker: '🔨 MAKERS', checker: '🔍 CHECKERS' };
    for (const level of levels) {
      const agents = [...AGENT_REGISTRY.values()].filter(a => a.level === level);
      console.log(`\n${labels[level]} (${agents.length})`);
      for (const a of agents) console.log(`  ${a.icon} ${a.name.padEnd(12)} ${a.title.padEnd(28)} ${a.team}`);
    }
    console.log('');
  });
} else if (cmd === 'status') {
  import('../core/memory.js').then(({ Memory }) => {
    const m = new Memory(process.cwd());
    const s = m.getSession();
    if (!s) { console.log('❌ No session. Run: npx citadel-ai init'); return; }
    m.refreshProjectHub();
    const tokens = m.getTokenSummary();
    const estimate = m.getContextEstimate();
    console.log(`\n📍 Phase: ${s.currentPhase} | Gate: ${s.currentGate} | Agent: ${s.activeAgent}`);
    if (tokens) {
      console.log(`🧮 Tokens: ${tokens.used.toLocaleString()} / ${tokens.limit.toLocaleString()} (${tokens.level}, ${tokens.status})`);
      console.log(`   Calls: ${tokens.requestCount} | Last: ${tokens.lastResponseTokens.toLocaleString()} | Peak: ${tokens.peakResponseTokens.toLocaleString()}`);
      console.log(`   Advice: ${tokens.advice}`);
    }
    if (estimate) {
      console.log(`🔮 Next request estimate: ${estimate.estimatedTokens.toLocaleString()} / ${estimate.limit.toLocaleString()} (${estimate.budgetLevel}, ${estimate.status})`);
      console.log(`   Estimate advice: ${estimate.advice}`);
    }
    console.log('');
  });
} else if (cmd === 'estimate') {
  import('../core/memory.js').then(({ Memory }) => {
    const m = new Memory(process.cwd());
    const s = m.getSession();
    if (!s) { console.log('❌ No session. Run: npx citadel-ai init'); return; }
    const taskHint = cmdArgs.join(' ').trim();
    m.refreshProjectHub(taskHint);
    const estimate = m.getContextEstimate(taskHint);
    if (!estimate) { console.log('❌ No estimate available.'); return; }
    console.log(`\n🔮 Context Estimate`);
    console.log(`📍 Phase: ${estimate.phase}`);
    console.log(`🧮 Estimated load: ${estimate.estimatedTokens.toLocaleString()} / ${estimate.limit.toLocaleString()} (${estimate.budgetLevel}, ${estimate.status})`);
    console.log(`   Split: conversation ${estimate.conversationTokens.toLocaleString()} | files ${estimate.fileTokens.toLocaleString()} | system ${estimate.systemTokens.toLocaleString()}`);
    if (estimate.taskHint) console.log(`   Task hint: ${estimate.taskHint}`);
    console.log(`   Advice: ${estimate.advice}`);
    console.log(`\nFiles considered:`);
    for (const file of estimate.filesConsidered) console.log(`  - ${file}`);
    console.log('');
  });
} else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
  console.log(`
🏰 CITADEL — AI delivery system for non-technical builders (v${CURRENT_VERSION})

  npx citadel-ai init      Initialize in your project
  npx citadel-ai update    Update framework (keeps your data)
  npx citadel-ai run       Start interactive build session
  npx citadel-ai status    Show phase, gate, token budget, and next estimate
  npx citadel-ai estimate  Estimate next-turn context pressure before execution
  npx citadel-ai agents    List all 42 agents
  npx citadel-ai help      This message

After init, you can also use slash commands in your IDE:
  /citadel-start   — Clarify and plan before code
  /citadel-help    — Guidance from ATLAS
  /citadel-build   — Start the maker team
  /citadel-fix     — Patch safely with change-impact review
  /citadel-review  — Run the checker team
  /citadel-ship    — Release readiness + rollback
  /citadel-estimate — Estimate context pressure before the next task
  /citadel-snapshot — Update context + handoff
  /citadel-status  — Phase, gate, and token dashboard

Codex support:
  AGENTS.md        — Lean Codex instructions with phased loading

Project hub:
  citadel/         — Human-readable project memory
  citadel/TOKENS.md — Session token telemetry
  .citadel/state/  — Internal runtime state
`);
} else if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
  console.log(`citadel-ai v${CURRENT_VERSION}`);
} else {
  console.log(`Unknown command: ${cmd}\nRun: npx citadel-ai help`);
  process.exit(1);
}
