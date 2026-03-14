import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { AGENT_REGISTRY, getAgentCount } from '../agents/registry.js';
import { Memory } from '../core/memory.js';
import { GateSystem } from '../core/gates.js';
import { AGENTS_DIR, GATES_DIR, HUB_FILE_COUNT, HUB_FILES, INTERNAL_DIR, PROJECT_HUB_DIR, PROJECT_SPECS_DIR, SKILLS_DIR, STATE_DIR, TEAMS_DIR, } from '../core/project-layout.js';
import { banner } from '../ui/terminal.js';
import { installAllIDEs, TEAM_FILE_COUNT, writeTeamFiles } from './ide-rules.js';
import { writeAgentPersonas, writeGettingStarted, writeProjectHubTemplates, writeSpecTemplates } from './init.js';
import { SKILL_FILE_COUNT, writeSkills } from './skills.js';
function ensureDir(path) {
    mkdirSync(path, { recursive: true });
}
function copyIfMissing(from, to) {
    if (!existsSync(from) || existsSync(to))
        return false;
    ensureDir(dirname(to));
    copyFileSync(from, to);
    return true;
}
function appendGitignore(projectPath) {
    const gitignorePath = join(projectPath, '.gitignore');
    const required = ['.citadel/state/', '.citadel/gates/'];
    if (!existsSync(gitignorePath)) {
        writeFileSync(gitignorePath, `# CITADEL internal state\n${required.join('\n')}\n`, 'utf-8');
        return;
    }
    const current = readFileSync(gitignorePath, 'utf-8');
    const missing = required.filter(line => !current.includes(line));
    if (!missing.length)
        return;
    appendFileSync(gitignorePath, `\n# CITADEL internal state\n${missing.join('\n')}\n`, 'utf-8');
}
function migrateLegacyState(projectPath) {
    const legacyDir = join(projectPath, INTERNAL_DIR, 'memory');
    const targetDir = join(projectPath, STATE_DIR);
    const migrated = [];
    for (const file of ['project.json', 'decisions.json', 'errors.json', 'session.json']) {
        if (copyIfMissing(join(legacyDir, file), join(targetDir, file)))
            migrated.push(file);
    }
    return migrated;
}
function migrateLegacyProjectHub(projectPath) {
    const legacyDir = join(projectPath, INTERNAL_DIR, 'vault');
    const targetDir = join(projectPath, PROJECT_HUB_DIR);
    const migrated = [];
    const map = [
        ['PROGRESS.md', HUB_FILES.status],
        ['CONTEXT_SNAPSHOT.md', HUB_FILES.context],
        ['SESSION_LOG.md', HUB_FILES.sessionLog],
        ['DECISIONS.md', HUB_FILES.decisions],
        ['CODE_INVENTORY.md', HUB_FILES.codebase],
        ['ARCHITECTURE.md', HUB_FILES.architecture],
    ];
    for (const [fromName, toName] of map) {
        if (copyIfMissing(join(legacyDir, fromName), join(targetDir, toName)))
            migrated.push(`${fromName} -> ${toName}`);
    }
    return migrated;
}
function migrateLegacySpecs(projectPath) {
    const legacyDir = join(projectPath, INTERNAL_DIR, 'specs');
    const targetDir = join(projectPath, PROJECT_SPECS_DIR);
    const migrated = [];
    for (const file of ['prd.md', 'adr.md', 'security.md', 'data-model.md', 'growth.md']) {
        if (copyIfMissing(join(legacyDir, file), join(targetDir, file)))
            migrated.push(file);
    }
    return migrated;
}
function ensureSessionAndGates(projectPath) {
    const memory = new Memory(projectPath);
    if (!memory.getSession())
        memory.initSession();
    const gates = new GateSystem(projectPath);
    for (const gateId of ['gate-0', 'gate-1', 'gate-2', 'gate-3', 'gate-4']) {
        const gatePath = join(projectPath, GATES_DIR, `${gateId}.json`);
        if (!existsSync(gatePath))
            gates.initGate(gateId);
    }
}
export async function updateCommand() {
    const projectPath = process.cwd();
    const citadelPath = join(projectPath, INTERNAL_DIR);
    if (!existsSync(citadelPath)) {
        console.log('❌ No CITADEL project found. Run: npx citadel-ai init');
        process.exit(1);
    }
    console.log(banner());
    console.log('⏳ Updating CITADEL framework files and migrating the project hub...\n');
    for (const dir of [
        citadelPath,
        join(projectPath, STATE_DIR),
        join(projectPath, GATES_DIR),
        join(projectPath, AGENTS_DIR),
        join(projectPath, TEAMS_DIR),
        join(projectPath, SKILLS_DIR),
        join(projectPath, PROJECT_HUB_DIR),
        join(projectPath, PROJECT_SPECS_DIR),
    ]) {
        ensureDir(dir);
    }
    const migratedState = migrateLegacyState(projectPath);
    const migratedHub = migrateLegacyProjectHub(projectPath);
    const migratedSpecs = migrateLegacySpecs(projectPath);
    writeFileSync(join(citadelPath, 'citadel.config.json'), JSON.stringify({
        version: '11.0.0',
        features: { autoGates: true, persistentMemory: true, chineseWalls: true },
    }, null, 2), 'utf-8');
    ensureSessionAndGates(projectPath);
    writeAgentPersonas(citadelPath);
    writeTeamFiles(citadelPath);
    writeSkills(citadelPath);
    writeSpecTemplates(projectPath, false);
    writeProjectHubTemplates(projectPath, false);
    writeGettingStarted(projectPath, false);
    new Memory(projectPath).refreshProjectHub();
    installAllIDEs(projectPath);
    appendGitignore(projectPath);
    console.log(`  ✅ ${AGENT_REGISTRY.size} agent personas updated (${AGENTS_DIR}/)`);
    console.log(`  ✅ ${TEAM_FILE_COUNT} team files updated (${TEAMS_DIR}/)`);
    console.log(`  ✅ ${SKILL_FILE_COUNT} skills updated (${SKILLS_DIR}/)`);
    console.log(`  ✅ Visible project hub ensured (${PROJECT_HUB_DIR}/, ${HUB_FILE_COUNT} files)`);
    console.log(`  ✅ Internal state ensured (${STATE_DIR}/, ${GATES_DIR}/)`);
    console.log('  ✅ AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, .windsurfrules updated');
    if (migratedState.length) {
        console.log(`  ✅ Migrated legacy runtime state: ${migratedState.join(', ')}`);
    }
    else {
        console.log('  ⏭️  Runtime state already aligned with v11');
    }
    if (migratedHub.length) {
        console.log(`  ✅ Migrated legacy vault files into ${PROJECT_HUB_DIR}/`);
    }
    else {
        console.log(`  ⏭️  No vault migration needed for ${PROJECT_HUB_DIR}/`);
    }
    if (migratedSpecs.length) {
        console.log(`  ✅ Migrated legacy specs into ${PROJECT_SPECS_DIR}/`);
    }
    else {
        console.log(`  ⏭️  Specs already present in ${PROJECT_SPECS_DIR}/`);
    }
    const c = getAgentCount();
    console.log(`
✅ CITADEL updated to v11.0.0 — ${c.total} agents.

  Visible project hub:
    ${PROJECT_HUB_DIR}/STATUS.md
    ${PROJECT_HUB_DIR}/CONTEXT.md
    ${PROJECT_HUB_DIR}/DECISIONS.md
    ${PROJECT_HUB_DIR}/ARCHITECTURE.md
    ${PROJECT_HUB_DIR}/CODEBASE.md
    ${PROJECT_HUB_DIR}/RUNBOOK.md
    ${PROJECT_HUB_DIR}/HANDOFF.md
    ${PROJECT_SPECS_DIR}/

  Internal engine:
    ${STATE_DIR}/     → runtime state
    ${GATES_DIR}/     → gate progress
    ${AGENTS_DIR}/    → agent personas
    ${TEAMS_DIR}/     → delivery pods
    ${SKILLS_DIR}/    → rules + skills

  Legacy compatibility:
    .citadel/memory/  → still readable if present
    .citadel/vault/   → migrated when possible, otherwise left untouched
    .citadel/specs/   → migrated when possible, otherwise left untouched
`);
}
//# sourceMappingURL=update.js.map