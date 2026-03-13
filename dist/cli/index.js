import { initCommand } from './init.js';
import { runCommand } from './run.js';
import { updateCommand } from './update.js';
const CURRENT_VERSION = '10.3.0';
// ── Background version check (non-blocking) ──
async function checkForUpdate() {
    try {
        const res = await fetch('https://registry.npmjs.org/citadel-ai/latest', { signal: AbortSignal.timeout(3000) });
        if (!res.ok)
            return;
        const data = await res.json();
        const latest = data.version;
        if (latest && latest !== CURRENT_VERSION) {
            console.log(`\n  ⬆️  New version available: ${latest} (current: ${CURRENT_VERSION})`);
            console.log(`     Run: npx citadel-ai update\n`);
        }
    }
    catch {
        // Silent fail — don't block the user
    }
}
const cmd = process.argv[2];
if (cmd === 'init' || cmd === 'install') {
    initCommand().then(() => checkForUpdate()).catch(e => { console.error(e.message); process.exit(1); });
}
else if (cmd === 'update' || cmd === 'upgrade') {
    updateCommand().catch(e => { console.error(e.message); process.exit(1); });
}
else if (cmd === 'run' || !cmd) {
    runCommand().catch(e => { console.error(e.message); process.exit(1); });
}
else if (cmd === 'agents') {
    checkForUpdate();
    import('../agents/registry.js').then(({ AGENT_REGISTRY }) => {
        console.log(`\n🏰 CITADEL — ${AGENT_REGISTRY.size} Agents\n`);
        const levels = ['command', 'c-suite', 'maker', 'checker'];
        const labels = { command: '⚡ COMMAND', 'c-suite': '👔 C-SUITE', maker: '🔨 MAKERS', checker: '🔍 CHECKERS' };
        for (const level of levels) {
            const agents = [...AGENT_REGISTRY.values()].filter(a => a.level === level);
            console.log(`\n${labels[level]} (${agents.length})`);
            for (const a of agents)
                console.log(`  ${a.icon} ${a.name.padEnd(12)} ${a.title.padEnd(28)} ${a.team}`);
        }
        console.log('');
    });
}
else if (cmd === 'status') {
    import('../core/memory.js').then(({ Memory }) => {
        const m = new Memory(process.cwd());
        const s = m.getSession();
        if (!s) {
            console.log('❌ No session. Run: npx citadel-ai init');
            return;
        }
        console.log(`\n📍 Phase: ${s.currentPhase} | Gate: ${s.currentGate} | Agent: ${s.activeAgent}\n`);
    });
}
else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    console.log(`
🏰 CITADEL — 42-Agent AI Development Framework (v${CURRENT_VERSION})

  npx citadel-ai init      Initialize in your project
  npx citadel-ai update    Update framework (keeps your data)
  npx citadel-ai run       Start interactive build session
  npx citadel-ai status    Show current phase & gate
  npx citadel-ai agents    List all 42 agents
  npx citadel-ai help      This message

After init, you can also use slash commands in your IDE:
  /citadel-help    — Guidance from ATLAS
  /citadel-build   — Start the maker team
  /citadel-review  — Run the checker team
  /citadel-status  — Phase & gate dashboard
`);
}
else if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    console.log(`citadel-ai v${CURRENT_VERSION}`);
}
else {
    console.log(`Unknown command: ${cmd}\nRun: npx citadel-ai help`);
    process.exit(1);
}
//# sourceMappingURL=index.js.map