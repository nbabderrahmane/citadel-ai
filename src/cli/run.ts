import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import type { CitadelConfig, LLMProvider } from '../core/types.js';
import { Orchestrator } from '../core/orchestrator.js';
import { banner, loadUI, divider } from '../ui/terminal.js';

function detectLLM(): { provider: LLMProvider; model: string; apiKey: string } | null {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) return { provider: 'anthropic', model: 'claude-sonnet-4-20250514', apiKey: anthropicKey };

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) return { provider: 'openai', model: 'gpt-4o', apiKey: openaiKey };

  return null;
}

export async function runCommand(): Promise<void> {
  const pp = process.cwd();
  const configPath = join(pp, '.citadel', 'citadel.config.json');

  if (!existsSync(configPath)) {
    console.log('❌ No CITADEL project found. Run: npx citadel-ai init');
    process.exit(1);
  }

  // Detect LLM from environment
  const llm = detectLLM();
  if (!llm) {
    console.log(`❌ No API key found. Set one of these environment variables:\n`);
    console.log(`   export ANTHROPIC_API_KEY=sk-ant-...`);
    console.log(`   export OPENAI_API_KEY=sk-...\n`);
    console.log(`💡 The interactive CLI needs an API key. For IDE-only usage,`);
    console.log(`   just open your project in Claude Code, Cursor, or Antigravity.\n`);
    process.exit(1);
  }

  // Build config
  const raw = JSON.parse(readFileSync(configPath, 'utf-8'));
  const config: CitadelConfig = {
    version: raw.version ?? '1.4.0',
    llm: { ...llm, maxTokens: 4096, temperature: 0.7 },
    projectPath: pp,
    citadelPath: join(pp, '.citadel'),
    features: raw.features ?? { webResearch: true, autoGates: true, persistentMemory: true, chineseWalls: true },
  };

  try { await loadUI(); } catch {}
  console.log(banner());
  console.log(`  Using: ${llm.provider} (${llm.model})\n`);
  console.log('Type your message. "help" if stuck. "exit" to quit.\n');

  const orc = new Orchestrator(config);
  console.log(await orc.processMessage('hello'));

  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '\n💬 You: ' });
  rl.prompt();
  rl.on('line', async (input: string) => {
    const t = input.trim();
    if (!t) { rl.prompt(); return; }
    if (t.toLowerCase() === 'exit') { console.log('\n👋 Saved.\n'); process.exit(0); }
    if (t.toLowerCase() === 'status') {
      const s = orc.getMemory().getSession();
      if (s) {
        console.log(divider() + `Phase: ${s.currentPhase} | Gate: ${s.currentGate}`);
        console.log(orc.getGates().getProgressSummary(s.currentGate));
      }
      rl.prompt(); return;
    }
    if (t.toLowerCase() === 'advance') { console.log(await orc.advancePhase()); rl.prompt(); return; }
    try { console.log(await orc.processMessage(t)); } catch (e: any) { console.log(`❌ ${e.message}`); }
    rl.prompt();
  });
  rl.on('close', () => { console.log('\n👋 Saved.\n'); process.exit(0); });
}
