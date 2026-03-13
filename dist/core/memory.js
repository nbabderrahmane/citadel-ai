// ═══ CITADEL — 4-Layer Persistent Memory ═══
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
export class Memory {
    mp;
    constructor(projectPath) {
        this.mp = join(projectPath, '.citadel', 'memory');
        for (const d of [
            join(projectPath, '.citadel'), this.mp,
            join(projectPath, '.citadel', 'gates'),
            join(projectPath, '.citadel', 'specs'),
        ]) {
            if (!existsSync(d))
                mkdirSync(d, { recursive: true });
        }
    }
    read(file, fallback) {
        const p = join(this.mp, file);
        if (!existsSync(p))
            return fallback;
        try {
            return JSON.parse(readFileSync(p, 'utf-8'));
        }
        catch {
            return fallback;
        }
    }
    write(file, data) {
        writeFileSync(join(this.mp, file), JSON.stringify(data, null, 2), 'utf-8');
    }
    // ── Project ──
    getProject() { return this.read('project.json', null); }
    saveProject(p) { p.updatedAt = new Date().toISOString(); this.write('project.json', p); }
    initProject(name, desc) {
        const p = { projectName: name, description: desc, techStack: {}, architecture: [], scope: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        this.saveProject(p);
        return p;
    }
    // ── Decisions ──
    getDecisions() { return this.read('decisions.json', []); }
    addDecision(d) {
        const ds = this.getDecisions();
        const full = { ...d, id: `dec-${Date.now()}`, timestamp: new Date().toISOString() };
        ds.push(full);
        this.write('decisions.json', ds);
        return full;
    }
    // ── Errors (prevents repeat mistakes) ──
    getErrors() { return this.read('errors.json', []); }
    addError(e) {
        const es = this.getErrors();
        const full = { ...e, id: `err-${Date.now()}`, timestamp: new Date().toISOString() };
        es.push(full);
        this.write('errors.json', es);
        return full;
    }
    getPreventionRules() { return this.getErrors().map(e => e.preventionRule).filter(Boolean); }
    // ── Session ──
    getSession() { return this.read('session.json', null); }
    saveSession(s) { s.updatedAt = new Date().toISOString(); this.write('session.json', s); }
    initSession() {
        const s = {
            currentPhase: 'inception', currentGate: 'gate-0', activeAgent: 'orchestrator',
            conversationHistory: [], loopState: null,
            startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        this.saveSession(s);
        return s;
    }
    addMessage(m) {
        const s = this.getSession();
        if (!s)
            return;
        s.conversationHistory.push({ ...m, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() });
        if (s.conversationHistory.length > 100)
            s.conversationHistory = s.conversationHistory.slice(-100);
        this.saveSession(s);
    }
    setActiveAgent(id) { const s = this.getSession(); if (s) {
        s.activeAgent = id;
        this.saveSession(s);
    } }
    setPhase(p) { const s = this.getSession(); if (s) {
        s.currentPhase = p;
        this.saveSession(s);
    } }
    setGate(g) { const s = this.getSession(); if (s) {
        s.currentGate = g;
        this.saveSession(s);
    } }
    // ── Context builder for LLM ──
    buildContext() {
        const p = this.getProject(), s = this.getSession();
        const ds = this.getDecisions().slice(-10), rules = this.getPreventionRules();
        let ctx = '## PROJECT CONTEXT\n';
        if (p) {
            ctx += `Name: ${p.projectName}\nDescription: ${p.description}\n`;
            if (Object.keys(p.techStack).length)
                ctx += `Stack: ${JSON.stringify(p.techStack)}\n`;
        }
        if (s)
            ctx += `\n## STATE\nPhase: ${s.currentPhase} | Gate: ${s.currentGate} | Agent: ${s.activeAgent}\n`;
        if (ds.length) {
            ctx += '\n## RECENT DECISIONS\n';
            for (const d of ds)
                ctx += `- [${d.agent}] ${d.title}\n`;
        }
        if (rules.length) {
            ctx += '\n## ERROR PREVENTION\n';
            for (const r of rules)
                ctx += `- ${r}\n`;
        }
        return ctx;
    }
}
//# sourceMappingURL=memory.js.map