// ═══ CITADEL — 4-Layer Persistent Memory ═══

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ProjectMemory, Decision, ErrorRecord, SessionState, PhaseId, ConversationMessage } from './types.js';

export class Memory {
  private mp: string;

  constructor(projectPath: string) {
    this.mp = join(projectPath, '.citadel', 'memory');
    for (const d of [
      join(projectPath, '.citadel'), this.mp,
      join(projectPath, '.citadel', 'gates'),
      join(projectPath, '.citadel', 'specs'),
    ]) {
      if (!existsSync(d)) mkdirSync(d, { recursive: true });
    }
  }

  private read<T>(file: string, fallback: T): T {
    const p = join(this.mp, file);
    if (!existsSync(p)) return fallback;
    try { return JSON.parse(readFileSync(p, 'utf-8')); }
    catch { return fallback; }
  }

  private write<T>(file: string, data: T): void {
    writeFileSync(join(this.mp, file), JSON.stringify(data, null, 2), 'utf-8');
  }

  // ── Project ──
  getProject(): ProjectMemory | null { return this.read('project.json', null); }
  saveProject(p: ProjectMemory): void { p.updatedAt = new Date().toISOString(); this.write('project.json', p); }
  initProject(name: string, desc: string): ProjectMemory {
    const p: ProjectMemory = { projectName: name, description: desc, techStack: {}, architecture: [], scope: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.saveProject(p); return p;
  }

  // ── Decisions ──
  getDecisions(): Decision[] { return this.read('decisions.json', []); }
  addDecision(d: Omit<Decision, 'id' | 'timestamp'>): Decision {
    const ds = this.getDecisions();
    const full = { ...d, id: `dec-${Date.now()}`, timestamp: new Date().toISOString() } as Decision;
    ds.push(full); this.write('decisions.json', ds); return full;
  }

  // ── Errors (prevents repeat mistakes) ──
  getErrors(): ErrorRecord[] { return this.read('errors.json', []); }
  addError(e: Omit<ErrorRecord, 'id' | 'timestamp'>): ErrorRecord {
    const es = this.getErrors();
    const full = { ...e, id: `err-${Date.now()}`, timestamp: new Date().toISOString() } as ErrorRecord;
    es.push(full); this.write('errors.json', es); return full;
  }
  getPreventionRules(): string[] { return this.getErrors().map(e => e.preventionRule).filter(Boolean); }

  // ── Session ──
  getSession(): SessionState | null { return this.read('session.json', null); }
  saveSession(s: SessionState): void { s.updatedAt = new Date().toISOString(); this.write('session.json', s); }
  initSession(): SessionState {
    const s: SessionState = {
      currentPhase: 'inception', currentGate: 'gate-0', activeAgent: 'orchestrator',
      conversationHistory: [], loopState: null,
      startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    this.saveSession(s); return s;
  }

  addMessage(m: Omit<ConversationMessage, 'id' | 'timestamp'>): void {
    const s = this.getSession(); if (!s) return;
    s.conversationHistory.push({ ...m, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() });
    if (s.conversationHistory.length > 100) s.conversationHistory = s.conversationHistory.slice(-100);
    this.saveSession(s);
  }

  setActiveAgent(id: string): void { const s = this.getSession(); if (s) { s.activeAgent = id; this.saveSession(s); } }
  setPhase(p: PhaseId): void { const s = this.getSession(); if (s) { s.currentPhase = p; this.saveSession(s); } }
  setGate(g: string): void { const s = this.getSession(); if (s) { (s as any).currentGate = g; this.saveSession(s); } }

  // ── Context builder for LLM ──
  buildContext(): string {
    const p = this.getProject(), s = this.getSession();
    const ds = this.getDecisions().slice(-10), rules = this.getPreventionRules();
    let ctx = '## PROJECT CONTEXT\n';
    if (p) { ctx += `Name: ${p.projectName}\nDescription: ${p.description}\n`; if (Object.keys(p.techStack).length) ctx += `Stack: ${JSON.stringify(p.techStack)}\n`; }
    if (s) ctx += `\n## STATE\nPhase: ${s.currentPhase} | Gate: ${s.currentGate} | Agent: ${s.activeAgent}\n`;
    if (ds.length) { ctx += '\n## RECENT DECISIONS\n'; for (const d of ds) ctx += `- [${d.agent}] ${d.title}\n`; }
    if (rules.length) { ctx += '\n## ERROR PREVENTION\n'; for (const r of rules) ctx += `- ${r}\n`; }
    return ctx;
  }
}
