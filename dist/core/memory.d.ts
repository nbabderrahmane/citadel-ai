import type { ProjectMemory, Decision, ErrorRecord, SessionState, PhaseId, ConversationMessage } from './types.js';
export declare class Memory {
    private mp;
    constructor(projectPath: string);
    private read;
    private write;
    getProject(): ProjectMemory | null;
    saveProject(p: ProjectMemory): void;
    initProject(name: string, desc: string): ProjectMemory;
    getDecisions(): Decision[];
    addDecision(d: Omit<Decision, 'id' | 'timestamp'>): Decision;
    getErrors(): ErrorRecord[];
    addError(e: Omit<ErrorRecord, 'id' | 'timestamp'>): ErrorRecord;
    getPreventionRules(): string[];
    getSession(): SessionState | null;
    saveSession(s: SessionState): void;
    initSession(): SessionState;
    addMessage(m: Omit<ConversationMessage, 'id' | 'timestamp'>): void;
    setActiveAgent(id: string): void;
    setPhase(p: PhaseId): void;
    setGate(g: string): void;
    buildContext(): string;
}
