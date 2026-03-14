import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GATES_DIR } from './project-layout.js';
const G = {
    'gate-0': { name: 'INCEPTION', blocker: 'All C-levels must sign off', checks: [{ id: 'g0-1', description: 'Project validated', agent: 'orchestrator' }, { id: 'g0-2', description: 'Scope by CPO', agent: 'cpo' }, { id: 'g0-3', description: 'Tech by CTO', agent: 'cto' }, { id: 'g0-4', description: 'Security by CISO', agent: 'ciso' }, { id: 'g0-5', description: 'Data by CDO', agent: 'cdo' }, { id: 'g0-6', description: 'Growth by CGO', agent: 'cgo' }] },
    'gate-1': { name: 'PRE-DESIGN', blocker: 'PRD must be approved', checks: [{ id: 'g1-1', description: 'PRD approved', agent: 'cpo' }, { id: 'g1-2', description: 'Stories complete', agent: 'cpo' }] },
    'gate-2': { name: 'PRE-BUILD', blocker: 'Architecture locked', checks: [{ id: 'g2-1', description: 'ADR approved', agent: 'cto' }, { id: 'g2-2', description: 'Data model OK', agent: 'cdo' }, { id: 'g2-3', description: 'Security reviewed', agent: 'ciso' }] },
    'gate-3': { name: 'PRE-SHIP', blocker: 'CISO absolute veto', checks: [{ id: 'g3-1', description: 'Code reviewed', agent: 'code-reviewer' }, { id: 'g3-2', description: 'Tests 80%+', agent: 'test-engineer' }, { id: 'g3-3', description: 'Security clean', agent: 'security-auditor' }, { id: 'g3-4', description: 'CISO sign-off', agent: 'ciso' }] },
    'gate-4': { name: 'POST-DEPLOY', blocker: 'Auto-rollback', checks: [{ id: 'g4-1', description: 'Monitoring active', agent: 'devops-engineer' }, { id: 'g4-2', description: 'Rollback tested', agent: 'devops-engineer' }] },
};
export class GateSystem {
    bp;
    constructor(pp) { this.bp = join(pp, GATES_DIR); }
    gp(id) { return join(this.bp, `${id}.json`); }
    ld(id) { const p = this.gp(id); if (existsSync(p))
        return JSON.parse(readFileSync(p, 'utf-8')); return this.initGate(id); }
    sv(g) { writeFileSync(this.gp(g.id), JSON.stringify(g, null, 2), 'utf-8'); }
    initGate(id) { const d = G[id]; if (!d)
        throw new Error(`Unknown gate: ${id}`); const g = { id, name: d.name, status: 'pending', blocker: d.blocker, signoffs: {}, checks: d.checks.map(c => ({ ...c, status: 'pending', timestamp: null, notes: '' })) }; this.sv(g); return g; }
    initAllGates() { Object.keys(G).forEach(id => this.initGate(id)); }
    getGate(id) { return this.ld(id); }
    passCheck(gid, cid, notes = '') { const g = this.ld(gid); const c = g.checks.find(x => x.id === cid); if (c) {
        c.status = 'passed';
        c.timestamp = new Date().toISOString();
        c.notes = notes;
    } g.status = g.checks.every(x => x.status === 'passed') ? 'passed' : 'in-progress'; this.sv(g); return g; }
    failCheck(gid, cid, notes) { const g = this.ld(gid); const c = g.checks.find(x => x.id === cid); if (c) {
        c.status = 'failed';
        c.timestamp = new Date().toISOString();
        c.notes = notes;
    } g.status = 'failed'; this.sv(g); return g; }
    vetoGate(gid) { const g = this.ld(gid); g.status = 'blocked'; g.signoffs['ciso'] = false; this.sv(g); return g; }
    canProceed(gid) { const g = this.ld(gid); const b = []; if (g.status === 'blocked')
        return { allowed: false, blockers: ['BLOCKED by CISO'] }; g.checks.filter(c => c.status !== 'passed').forEach(c => b.push(`[${c.status}] ${c.description}`)); if (gid === 'gate-3' && !g.signoffs['ciso'])
        b.push('CISO not signed off'); return { allowed: b.length === 0, blockers: b }; }
    getProgressSummary(gid) { const g = this.ld(gid); const p = g.checks.filter(c => c.status === 'passed').length; let s = `\n🚧 ${g.name} — ${p}/${g.checks.length} (${g.status})\n`; g.checks.forEach(c => { const i = c.status === 'passed' ? '✅' : c.status === 'failed' ? '❌' : '⬜'; s += `  ${i} ${c.description}\n`; }); if (g.status !== 'passed')
        s += `  ⛔ ${g.blocker}\n`; return s; }
}
//# sourceMappingURL=gates.js.map