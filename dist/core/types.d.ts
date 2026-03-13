export type AgentLevel = 'command' | 'c-suite' | 'maker' | 'checker';
export type TeamId = 'cto' | 'cpo' | 'cgo' | 'ciso' | 'cdo';
export type GateId = 'gate-0' | 'gate-1' | 'gate-2' | 'gate-3' | 'gate-4';
export type GateStatus = 'pending' | 'in-progress' | 'passed' | 'failed' | 'blocked';
export type LoopId = 'design' | 'build' | 'security' | 'debug';
export type PhaseId = 'inception' | 'specification' | 'architecture' | 'build' | 'validation' | 'ship';
export type LLMProvider = 'anthropic' | 'openai';
export interface AgentDefinition {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    level: AgentLevel;
    parent: string | null;
    team: TeamId | 'command';
    icon: string;
    color: string;
    inspiration: string;
    philosophy: string;
    personality: string;
    voice: string;
    inputs: string[];
    outputs: string[];
    principles: string[];
    rules: string[];
    systemPrompt: string;
}
export interface ProjectMemory {
    projectName: string;
    description: string;
    techStack: Record<string, string>;
    architecture: string[];
    scope: string[];
    createdAt: string;
    updatedAt: string;
}
export interface Decision {
    id: string;
    timestamp: string;
    agent: string;
    gate: GateId | null;
    phase: PhaseId;
    title: string;
    description: string;
    alternatives: string[];
    reasoning: string;
}
export interface ErrorRecord {
    id: string;
    timestamp: string;
    agent: string;
    phase: PhaseId;
    error: string;
    rootCause: string;
    fix: string;
    filesAffected: string[];
    preventionRule: string;
}
export interface SessionState {
    currentPhase: PhaseId;
    currentGate: GateId;
    activeAgent: string;
    conversationHistory: ConversationMessage[];
    loopState: LoopState | null;
    startedAt: string;
    updatedAt: string;
}
export interface LoopState {
    loopId: LoopId;
    iteration: number;
    maxIterations: number;
    agents: string[];
    status: 'active' | 'escaped' | 'completed';
    reason: string;
}
export interface GateCheck {
    id: string;
    description: string;
    agent: string;
    status: 'pending' | 'passed' | 'failed';
    timestamp: string | null;
    notes: string;
}
export interface GateState {
    id: GateId;
    name: string;
    status: GateStatus;
    checks: GateCheck[];
    blocker: string;
    signoffs: Record<string, boolean>;
}
export interface ConversationMessage {
    id: string;
    role: 'user' | 'agent' | 'system';
    agent?: string;
    content: string;
    timestamp: string;
    phase: PhaseId;
    gate: GateId;
    metadata?: Record<string, unknown>;
}
export interface WorkUnit {
    id: string;
    type: 'code' | 'spec' | 'schema' | 'design' | 'test';
    createdBy: string;
    reviewedBy: string | null;
    status: 'pending' | 'approved' | 'rejected';
    content: string;
    feedback: string;
    attempts: number;
}
export interface LLMConfig {
    provider: LLMProvider;
    model: string;
    apiKey: string;
    maxTokens: number;
    temperature: number;
}
export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMResponse {
    content: string;
    tokensUsed: number;
    model: string;
}
export interface CitadelConfig {
    version: string;
    llm: LLMConfig;
    projectPath: string;
    citadelPath: string;
    features: {
        webResearch: boolean;
        autoGates: boolean;
        persistentMemory: boolean;
        chineseWalls: boolean;
    };
}
