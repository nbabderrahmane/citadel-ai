import type { GateId, GateState } from './types.js';
export declare class GateSystem {
    private bp;
    constructor(pp: string);
    private gp;
    private ld;
    private sv;
    initGate(id: GateId): GateState;
    initAllGates(): void;
    getGate(id: GateId): GateState;
    passCheck(gid: GateId, cid: string, notes?: string): GateState;
    failCheck(gid: GateId, cid: string, notes: string): GateState;
    vetoGate(gid: GateId): GateState;
    canProceed(gid: GateId): {
        allowed: boolean;
        blockers: string[];
    };
    getProgressSummary(gid: GateId): string;
}
