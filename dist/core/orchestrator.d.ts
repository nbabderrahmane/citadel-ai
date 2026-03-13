import type { CitadelConfig } from './types.js';
import { Memory } from './memory.js';
import { GateSystem } from './gates.js';
export declare class Orchestrator {
    private config;
    private memory;
    private gates;
    private loops;
    private llm;
    private totalTokens;
    constructor(config: CitadelConfig);
    getMemory(): Memory;
    getGates(): GateSystem;
    getTotalTokens(): number;
    processMessage(userMessage: string): Promise<string>;
    advancePhase(): Promise<string>;
    private routeMessage;
    private buildPrompt;
    private isHelpRequest;
    private handleHelp;
    private formatResponse;
}
