// ═══ CITADEL — 4-Layer Persistent Memory ═══

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ContextEstimateSummary,
  ConversationMessage,
  Decision,
  ErrorRecord,
  PhaseId,
  ProjectMemory,
  SessionState,
  TokenBudgetLevel,
  TokenBudgetStatus,
  TokenBudgetSummary,
  TokenUsageSnapshot,
} from './types.js';
import { GATES_DIR, HUB_FILES, INTERNAL_DIR, PROJECT_HUB_DIR, PROJECT_SPECS_DIR, STATE_DIR } from './project-layout.js';

const TOKEN_BUDGET_LIMITS: Record<TokenBudgetLevel, number> = {
  light: 4000,
  medium: 12000,
  heavy: 24000,
};

export class Memory {
  private projectPath: string;
  private mp: string;
  private legacyMp: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.mp = join(projectPath, STATE_DIR);
    this.legacyMp = join(projectPath, INTERNAL_DIR, 'memory');
    for (const d of [
      join(projectPath, INTERNAL_DIR),
      this.mp,
      join(projectPath, GATES_DIR),
      join(projectPath, PROJECT_HUB_DIR),
      join(projectPath, PROJECT_SPECS_DIR),
    ]) {
      if (!existsSync(d)) mkdirSync(d, { recursive: true });
    }
  }

  private read<T>(file: string, fallback: T): T {
    const candidates = [join(this.mp, file), join(this.legacyMp, file)];
    for (const p of candidates) {
      if (!existsSync(p)) continue;
      try { return JSON.parse(readFileSync(p, 'utf-8')); }
      catch { return fallback; }
    }
    return fallback;
  }

  private write<T>(file: string, data: T): void {
    writeFileSync(join(this.mp, file), JSON.stringify(data, null, 2), 'utf-8');
  }

  private hubPath(file: string): string {
    return join(this.projectPath, PROJECT_HUB_DIR, file);
  }

  private defaultTokenUsage(): TokenUsageSnapshot {
    return {
      totalTokens: 0,
      requestCount: 0,
      lastResponseTokens: 0,
      peakResponseTokens: 0,
      lastAgent: null,
      lastModel: null,
      updatedAt: null,
      byAgent: {},
    };
  }

  private normalizeSession(session: SessionState | null): SessionState | null {
    if (!session) return null;
    return {
      ...session,
      tokenUsage: {
        ...this.defaultTokenUsage(),
        ...(session as Partial<SessionState>).tokenUsage,
        byAgent: (session as Partial<SessionState>).tokenUsage?.byAgent ?? {},
      },
    };
  }

  private getBudgetLevel(phase: PhaseId): TokenBudgetLevel {
    if (phase === 'inception' || phase === 'specification') return 'light';
    if (phase === 'ship') return 'heavy';
    return 'medium';
  }

  private getBudgetStatus(used: number, limit: number): TokenBudgetStatus {
    if (used >= limit) return 'critical';
    if (used >= Math.floor(limit * 0.7)) return 'warning';
    return 'healthy';
  }

  private buildBudgetAdvice(status: TokenBudgetStatus): string {
    if (status === 'healthy') return 'Keep the context narrow. Load only the files needed for the next step.';
    if (status === 'warning') return 'Context is getting expensive. Prefer a snapshot, smaller tasks, or a fresh handoff.';
    return 'Budget exceeded. Stop inflating context, snapshot the state, and resume in a smaller session.';
  }

  private roughTokenCount(text: string): number {
    return Math.max(1, Math.ceil(text.length / 4));
  }

  private fileTokenCount(path: string): number {
    if (!existsSync(path)) return 0;
    try {
      return this.roughTokenCount(readFileSync(path, 'utf-8'));
    } catch {
      return 0;
    }
  }

  private resolveEstimateFiles(phase: PhaseId, taskHint: string | null): string[] {
    const hint = (taskHint ?? '').toLowerCase();
    const files = new Set<string>([
      '.citadel/skills/rules_essential.md',
      `${PROJECT_HUB_DIR}/${HUB_FILES.status}`,
    ]);

    if (hint || phase !== 'inception') files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.context}`);
    if (hint) files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.handoff}`);

    if (phase === 'inception' || phase === 'specification') {
      files.add('.citadel/teams/c-suite.md');
    }

    if (phase === 'architecture' || phase === 'build' || phase === 'validation' || phase === 'ship') {
      files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.decisions}`);
      files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.architecture}`);
      files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.codebase}`);
      files.add(`${PROJECT_SPECS_DIR}/implementation-plan.md`);
      files.add('.citadel/skills/skills_implementation_plan.md');
    }

    const isFrontend = ['frontend', 'ui', 'ux', 'design', 'page', 'layout', 'css', 'react', 'landing'].some(word => hint.includes(word));
    const isBackend = ['backend', 'api', 'server', 'service', 'database', 'schema'].some(word => hint.includes(word));
    const isFix = ['fix', 'bug', 'hotfix', 'incident', 'regression', 'broken'].some(word => hint.includes(word));
    const isShip = ['ship', 'release', 'deploy', 'launch', 'prod', 'production'].some(word => hint.includes(word));
    const isSecurity = ['security', 'auth', 'login', 'signup', 'password', 'token', 'oauth', 'jwt'].some(word => hint.includes(word));

    if (isFrontend) {
      files.add('.citadel/teams/frontend-pod.md');
      files.add('.citadel/skills/skills_frontend.md');
      files.add('.citadel/skills/skills_uiux.md');
      files.add('.citadel/skills/skills_visual_design.md');
      files.add('.citadel/skills/skills_design_system.md');
    }

    if (isBackend || (!isFrontend && (phase === 'architecture' || phase === 'build' || phase === 'validation'))) {
      files.add('.citadel/teams/backend-pod.md');
      files.add('.citadel/skills/skills_backend.md');
      files.add('.citadel/skills/skills_data.md');
    }

    if (isFix) {
      files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.runbook}`);
      files.add('.citadel/skills/skills_hotfix_rca.md');
      files.add('.citadel/skills/skills_change_safety.md');
    }

    if (isShip || phase === 'ship') {
      files.add(`${PROJECT_HUB_DIR}/${HUB_FILES.runbook}`);
      files.add('.citadel/teams/ciso-all.md');
      files.add('.citadel/teams/cto-makers.md');
      files.add('.citadel/skills/skills_release_runbook.md');
      files.add('.citadel/skills/skills_change_safety.md');
    }

    if (isSecurity) {
      files.add('.citadel/teams/ciso-all.md');
      files.add('.citadel/skills/skills_security.md');
      files.add('.citadel/skills/skills_change_safety.md');
    }

    return [...files];
  }

  private buildEstimateAdvice(status: TokenBudgetStatus): string {
    if (status === 'healthy') return 'Estimated context is under control. You can proceed, but still load only what is needed.';
    if (status === 'warning') return 'Estimated context is getting heavy. Split the task or skip non-essential files before asking the model to act.';
    return 'Estimated context is too heavy for a clean next turn. Snapshot, narrow the task, or start a fresh focused session.';
  }

  private summarizeTokenUsage(session: SessionState): TokenBudgetSummary {
    const level = this.getBudgetLevel(session.currentPhase);
    const limit = TOKEN_BUDGET_LIMITS[level];
    const used = session.tokenUsage.totalTokens;
    const usagePercent = limit === 0 ? 0 : Math.round((used / limit) * 100);
    const status = this.getBudgetStatus(used, limit);

    return {
      level,
      limit,
      status,
      used,
      usagePercent,
      requestCount: session.tokenUsage.requestCount,
      lastResponseTokens: session.tokenUsage.lastResponseTokens,
      peakResponseTokens: session.tokenUsage.peakResponseTokens,
      lastAgent: session.tokenUsage.lastAgent,
      lastModel: session.tokenUsage.lastModel,
      updatedAt: session.tokenUsage.updatedAt,
      advice: this.buildBudgetAdvice(status),
    };
  }

  estimateContextPressure(taskHint?: string): ContextEstimateSummary | null {
    const session = this.getSession();
    if (!session) return null;

    const budgetLevel = this.getBudgetLevel(session.currentPhase);
    const limit = TOKEN_BUDGET_LIMITS[budgetLevel];
    const conversationText = session.conversationHistory
      .slice(-4)
      .map(message => message.content)
      .join('\n');
    const conversationTokens = conversationText ? this.roughTokenCount(conversationText) : 0;
    const filesConsidered = this.resolveEstimateFiles(session.currentPhase, taskHint?.trim() ? taskHint.trim() : null);
    const fileTokens = filesConsidered
      .map(relativePath => this.fileTokenCount(join(this.projectPath, relativePath)))
      .reduce((sum, tokens) => sum + tokens, 0);
    const systemTokens = 450;
    const estimatedTokens = conversationTokens + fileTokens + systemTokens;
    const usagePercent = limit === 0 ? 0 : Math.round((estimatedTokens / limit) * 100);
    const status = this.getBudgetStatus(estimatedTokens, limit);

    return {
      phase: session.currentPhase,
      budgetLevel,
      limit,
      estimatedTokens,
      usagePercent,
      status,
      taskHint: taskHint?.trim() ? taskHint.trim() : null,
      conversationTokens,
      fileTokens,
      systemTokens,
      filesConsidered,
      advice: this.buildEstimateAdvice(status),
    };
  }

  private preview(text: string, max = 160): string {
    const singleLine = text.replace(/\s+/g, ' ').trim();
    if (singleLine.length <= max) return singleLine;
    return `${singleLine.slice(0, max - 3)}...`;
  }

  private syncStatusFile(session: SessionState, estimate = this.estimateContextPressure()): void {
    const latest = session.conversationHistory.at(-1);
    const tokenSummary = this.summarizeTokenUsage(session);
    const lines = [
      '# CITADEL Status',
      '',
      '## Current State',
      `- **Phase:** ${session.currentPhase}`,
      `- **Gate:** ${session.currentGate}`,
      `- **Active agent:** ${session.activeAgent}`,
      '',
      '## Token Budget',
      `- **Budget:** ${tokenSummary.level}`,
      `- **Used:** ${tokenSummary.used.toLocaleString()} / ${tokenSummary.limit.toLocaleString()} tokens (${tokenSummary.usagePercent}%)`,
      `- **Status:** ${tokenSummary.status}`,
      `- **Calls:** ${tokenSummary.requestCount} | **Last response:** ${tokenSummary.lastResponseTokens.toLocaleString()} | **Peak:** ${tokenSummary.peakResponseTokens.toLocaleString()}`,
      '',
      '## Next Request Estimate',
      `- **Estimated load:** ${estimate?.estimatedTokens.toLocaleString() ?? 0} / ${estimate?.limit.toLocaleString() ?? 0} tokens (${estimate?.budgetLevel ?? 'light'}, ${estimate?.status ?? 'healthy'})`,
      `- **Estimate guidance:** ${estimate?.advice ?? 'No estimate available.'}`,
      '',
      '## Latest Signal',
      latest
        ? `- **${latest.role === 'user' ? 'User' : latest.agent ?? 'Agent'}:** ${this.preview(latest.content)}`
        : '- No conversation yet',
      '',
      '## Next Step',
      '- Continue from the current phase and protect existing invariants before changing code.',
      `- ${tokenSummary.advice}`,
      '',
    ];
    writeFileSync(this.hubPath(HUB_FILES.status), lines.join('\n'), 'utf-8');
  }

  private appendSessionLogEntry(entry: ConversationMessage): void {
    const logPath = this.hubPath(HUB_FILES.sessionLog);
    if (!existsSync(logPath)) {
      writeFileSync(logPath, '# CITADEL Session Log\n\n> Append-only. This is the readable history of what happened in the project.\n\n---\n', 'utf-8');
    }

    const actor = entry.role === 'user' ? 'User' : entry.agent ?? 'Agent';
    appendFileSync(logPath, `\n### ${actor}\n- **When:** ${entry.timestamp}\n- **Phase:** ${entry.phase}\n- **Gate:** ${entry.gate}\n- **Message:** ${this.preview(entry.content, 220)}\n`, 'utf-8');
  }

  private syncDecisionsFile(decisions: Decision[]): void {
    const lines = ['# CITADEL Decisions', '', '> Architecture, product, and implementation decisions live here.', '', '---', ''];

    if (!decisions.length) {
      lines.push('<!-- New decisions will be appended here -->', '');
      writeFileSync(this.hubPath(HUB_FILES.decisions), lines.join('\n'), 'utf-8');
      return;
    }

    for (const decision of decisions) {
      lines.push(`## ${decision.title}`);
      lines.push(`- **Agent:** ${decision.agent}`);
      lines.push(`- **Phase:** ${decision.phase}`);
      lines.push(`- **Gate:** ${decision.gate ?? 'n/a'}`);
      lines.push(`- **When:** ${decision.timestamp}`);
      lines.push('');
      lines.push(decision.description);
      if (decision.reasoning) {
        lines.push('');
        lines.push(`**Reasoning:** ${decision.reasoning}`);
      }
      if (decision.alternatives.length) {
        lines.push('');
        lines.push('**Alternatives considered:**');
        for (const alternative of decision.alternatives) lines.push(`- ${alternative}`);
      }
      lines.push('');
    }

    writeFileSync(this.hubPath(HUB_FILES.decisions), lines.join('\n'), 'utf-8');
  }

  private syncTokenFile(session: SessionState, estimate = this.estimateContextPressure()): void {
    const summary = this.summarizeTokenUsage(session);
    const topAgents = Object.entries(session.tokenUsage.byAgent)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);

    const lines = [
      '# CITADEL Tokens',
      '',
      '## Session Budget',
      `- **Budget:** ${summary.level}`,
      `- **Limit:** ${summary.limit.toLocaleString()} tokens`,
      `- **Used:** ${summary.used.toLocaleString()} tokens`,
      `- **Status:** ${summary.status}`,
      `- **Usage:** ${summary.usagePercent}%`,
      '',
      '## Session Metrics',
      `- **LLM calls:** ${summary.requestCount}`,
      `- **Last response:** ${summary.lastResponseTokens.toLocaleString()} tokens`,
      `- **Peak response:** ${summary.peakResponseTokens.toLocaleString()} tokens`,
      `- **Last agent:** ${summary.lastAgent ?? 'n/a'}`,
      `- **Last model:** ${summary.lastModel ?? 'n/a'}`,
      `- **Last updated:** ${summary.updatedAt ?? 'n/a'}`,
      '',
      '## Guidance',
      `- ${summary.advice}`,
      '',
      '## Next Request Estimate',
      `- **Estimated load:** ${estimate?.estimatedTokens.toLocaleString() ?? 0} tokens`,
      `- **Budget target:** ${estimate?.budgetLevel ?? 'light'} (${estimate?.limit.toLocaleString() ?? 0})`,
      `- **Status:** ${estimate?.status ?? 'healthy'} (${estimate?.usagePercent ?? 0}%)`,
      `- **Conversation share:** ${estimate?.conversationTokens.toLocaleString() ?? 0}`,
      `- **File share:** ${estimate?.fileTokens.toLocaleString() ?? 0}`,
      `- **System overhead:** ${estimate?.systemTokens.toLocaleString() ?? 0}`,
      `- **Advice:** ${estimate?.advice ?? 'No estimate available.'}`,
      '',
      '## Estimated Files',
    ];

    if (!estimate?.filesConsidered.length) {
      lines.push('- No estimate available yet.');
    } else {
      for (const file of estimate.filesConsidered.slice(0, 10)) {
        lines.push(`- \`${file}\``);
      }
    }

    lines.push(
      '',
      '## By Agent',
    );

    if (!topAgents.length) {
      lines.push('- No LLM calls recorded yet.');
    } else {
      for (const [agent, tokens] of topAgents) {
        lines.push(`- **${agent}:** ${tokens.toLocaleString()} tokens`);
      }
    }

    lines.push('');
    writeFileSync(this.hubPath(HUB_FILES.tokens), lines.join('\n'), 'utf-8');
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
    ds.push(full);
    this.write('decisions.json', ds);
    this.syncDecisionsFile(ds);
    return full;
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
  getSession(): SessionState | null { return this.normalizeSession(this.read('session.json', null)); }
  getTokenSummary(): TokenBudgetSummary | null {
    const session = this.getSession();
    return session ? this.summarizeTokenUsage(session) : null;
  }
  getContextEstimate(taskHint?: string): ContextEstimateSummary | null {
    return this.estimateContextPressure(taskHint);
  }
  refreshProjectHub(taskHint?: string): void {
    const session = this.getSession();
    if (!session) return;
    const estimate = this.estimateContextPressure(taskHint);
    this.syncStatusFile(session, estimate);
    this.syncTokenFile(session, estimate);
  }
  saveSession(s: SessionState): void {
    s = this.normalizeSession(s) as SessionState;
    s.updatedAt = new Date().toISOString();
    this.write('session.json', s);
    this.refreshProjectHub();
  }
  initSession(): SessionState {
    const s: SessionState = {
      currentPhase: 'inception', currentGate: 'gate-0', activeAgent: 'orchestrator',
      conversationHistory: [], loopState: null,
      tokenUsage: this.defaultTokenUsage(),
      startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    this.saveSession(s); return s;
  }

  recordTokenUsage(agentId: string, tokensUsed: number, model: string): TokenBudgetSummary {
    const session = this.getSession() ?? this.initSession();
    session.tokenUsage.totalTokens += tokensUsed;
    session.tokenUsage.requestCount += 1;
    session.tokenUsage.lastResponseTokens = tokensUsed;
    session.tokenUsage.peakResponseTokens = Math.max(session.tokenUsage.peakResponseTokens, tokensUsed);
    session.tokenUsage.lastAgent = agentId;
    session.tokenUsage.lastModel = model;
    session.tokenUsage.updatedAt = new Date().toISOString();
    session.tokenUsage.byAgent[agentId] = (session.tokenUsage.byAgent[agentId] ?? 0) + tokensUsed;
    this.saveSession(session);
    return this.summarizeTokenUsage(session);
  }

  addMessage(m: Omit<ConversationMessage, 'id' | 'timestamp'>): void {
    const s = this.getSession(); if (!s) return;
    const fullMessage = { ...m, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() };
    s.conversationHistory.push(fullMessage);
    if (s.conversationHistory.length > 100) s.conversationHistory = s.conversationHistory.slice(-100);
    this.saveSession(s);
    this.appendSessionLogEntry(fullMessage);
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
    if (s) {
      const tokens = this.summarizeTokenUsage(s);
      ctx += `\n## TOKEN BUDGET\nBudget: ${tokens.level} (${tokens.limit} tokens) | Used: ${tokens.used} | Status: ${tokens.status}\n`;
    }
    if (ds.length) { ctx += '\n## RECENT DECISIONS\n'; for (const d of ds) ctx += `- [${d.agent}] ${d.title}\n`; }
    if (rules.length) { ctx += '\n## ERROR PREVENTION\n'; for (const r of rules) ctx += `- ${r}\n`; }
    return ctx;
  }
}
