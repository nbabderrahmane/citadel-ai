import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AGENT_REGISTRY } from '../agents/registry.js';
import { getAgentCount } from '../agents/registry.js';
import { installAllIDEs, writeTeamFiles } from './ide-rules.js';
import { writeSkills } from './skills.js';
import { writeFileSync } from 'node:fs';
import { banner } from '../ui/terminal.js';
function writeAgentPersonas(cp) {
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
export async function updateCommand() {
    const pp = process.cwd();
    const cp = join(pp, '.citadel');
    if (!existsSync(cp)) {
        console.log('❌ No CITADEL project found. Run: npx citadel-ai init');
        process.exit(1);
    }
    console.log(banner());
    console.log('⏳ Updating CITADEL framework files...\n');
    console.log('  ⚠️  Your data is safe — vault/, specs/, memory/, gates/ are NOT touched.\n');
    // Update framework files ONLY
    writeAgentPersonas(cp);
    console.log('  ✅ .citadel/agents/  — 42 agent personas updated');
    writeTeamFiles(cp);
    console.log('  ✅ .citadel/teams/   — 10 team files updated');
    writeSkills(cp);
    console.log('  ✅ .citadel/skills/  — 7 engineering standards updated');
    installAllIDEs(pp);
    console.log('  ✅ CLAUDE.md         — updated');
    console.log('  ✅ .cursorrules      — updated');
    console.log('  ✅ GEMINI.md         — updated');
    console.log('  ✅ .windsurfrules    — updated');
    console.log('  ✅ Slash commands    — updated');
    // Create vault if it doesn't exist (for users upgrading from pre-1.5)
    const vaultDir = join(cp, 'vault');
    if (!existsSync(vaultDir)) {
        mkdirSync(vaultDir, { recursive: true });
        writeFileSync(join(vaultDir, 'PROGRESS.md'), `# Project Progress\n\n## Current State\n- **Phase:** Unknown (upgraded from older version)\n- **Status:** Check .citadel/specs/ for existing work\n\n## Next\n- [ ] Review existing specs\n- [ ] Continue building\n`, 'utf-8');
        writeFileSync(join(vaultDir, 'CONTEXT_SNAPSHOT.md'), `# Context Snapshot\n\n## Last Updated\nCreated during upgrade to v1.5+\n\n## Where We Left Off\nProject upgraded from older CITADEL version. Check specs/ for existing work.\n`, 'utf-8');
        writeFileSync(join(vaultDir, 'SESSION_LOG.md'), `# Session Log\n\n---\n\n### Session: Upgrade\n- **Date:** ${new Date().toISOString().split('T')[0]}\n- **Action:** Upgraded CITADEL to v1.5+ (vault memory system added)\n\n---\n`, 'utf-8');
        writeFileSync(join(vaultDir, 'DECISIONS.md'), `# Decisions Log\n\n<!-- Decisions will be appended by C-Suite agents -->\n`, 'utf-8');
        writeFileSync(join(vaultDir, 'CODE_INVENTORY.md'), `# Code Inventory\n\n<!-- Updated by maker agents -->\n`, 'utf-8');
        writeFileSync(join(vaultDir, 'ARCHITECTURE.md'), `# Architecture\n\n<!-- Updated by LINUS (CTO) -->\n`, 'utf-8');
        console.log('  ✅ .citadel/vault/   — created (new in this version)');
    }
    else {
        console.log('  ⏭️  .citadel/vault/   — kept as-is (your data)');
    }
    const c = getAgentCount();
    console.log(`
✅ CITADEL updated to v10.0.0 — ${c.total} agents.

  What was updated:
    agents/     → Latest agent personas and rules
    teams/      → Latest team files for phased loading
    IDE rules   → Latest CLAUDE.md, GEMINI.md, etc.
    Commands    → Latest slash commands

  What was NOT touched:
    vault/      → Your project memory (progress, decisions, etc.)
    specs/      → Your PRD, ADR, security, data model
    memory/     → Your session state
    gates/      → Your gate progress
`);
}
//# sourceMappingURL=update.js.map