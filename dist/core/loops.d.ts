import type { LoopId, LoopState } from './types.js';
interface LoopDefinition {
    id: LoopId;
    name: string;
    maxIterations: number;
    agents: string[];
    description: string;
}
export declare class LoopManager {
    private activeLoop;
    startLoop(loopId: LoopId): LoopState;
    iterate(result: 'pass' | 'fail', reason: string): LoopState;
    getActiveLoop(): LoopState | null;
    getCurrentAgent(): string | null;
    shouldEscalate(): boolean;
    endLoop(): void;
    getLoopInfo(loopId: LoopId): LoopDefinition | undefined;
    static getAllLoops(): LoopDefinition[];
}
export {};
