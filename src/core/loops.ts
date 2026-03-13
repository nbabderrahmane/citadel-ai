// ═══════════════════════════════════════════════════════════════
// CITADEL — Loop Manager (Iterative Refinement Cycles)
// ═══════════════════════════════════════════════════════════════

import type { LoopId, LoopState } from './types.js';

interface LoopDefinition {
  id: LoopId;
  name: string;
  maxIterations: number;
  agents: string[];
  description: string;
}

const LOOPS: Record<LoopId, LoopDefinition> = {
  design: {
    id: 'design',
    name: 'Design Loop',
    maxIterations: 5,
    agents: ['marty', 'jony', 'teresa', 'strunk', 'jakob', 'razor'],
    description: 'CPO → UX → Analyst → Spec → UX Review → Scope Check',
  },
  build: {
    id: 'build',
    name: 'Build Loop',
    maxIterations: 5,
    agents: ['uncle-bob', 'dan', 'steipete', 'guido', 'kent', 'brendan'],
    description: 'Backend → Frontend → Mobile → Code Review → Tests → Performance',
  },
  security: {
    id: 'security',
    name: 'Security Loop',
    maxIterations: 3,
    agents: ['filippo', 'moxie', 'max', 'charlie', 'window'],
    description: 'Auth → Encryption → Compliance → Pentest → Audit',
  },
  debug: {
    id: 'debug',
    name: 'Debug Loop',
    maxIterations: 10,
    agents: ['uncle-bob', 'dan', 'kent', 'brendan'],
    description: 'Identify → Fix → Test → Verify Performance',
  },
};

export class LoopManager {
  private activeLoop: LoopState | null = null;

  startLoop(loopId: LoopId): LoopState {
    const def = LOOPS[loopId];
    if (!def) throw new Error(`Unknown loop: ${loopId}`);

    this.activeLoop = {
      loopId: def.id,
      iteration: 1,
      maxIterations: def.maxIterations,
      agents: def.agents,
      status: 'active',
      reason: `Started: ${def.name}`,
    };
    return this.activeLoop;
  }

  iterate(result: 'pass' | 'fail', reason: string): LoopState {
    if (!this.activeLoop) throw new Error('No active loop');

    if (result === 'pass') {
      this.activeLoop.status = 'completed';
      this.activeLoop.reason = reason;
      return this.activeLoop;
    }

    this.activeLoop.iteration++;
    if (this.activeLoop.iteration > this.activeLoop.maxIterations) {
      this.activeLoop.status = 'escaped';
      this.activeLoop.reason = `Max iterations (${this.activeLoop.maxIterations}) reached. Escalating.`;
      return this.activeLoop;
    }

    this.activeLoop.reason = reason;
    return this.activeLoop;
  }

  getActiveLoop(): LoopState | null { return this.activeLoop; }

  getCurrentAgent(): string | null {
    if (!this.activeLoop || this.activeLoop.status !== 'active') return null;
    const idx = (this.activeLoop.iteration - 1) % this.activeLoop.agents.length;
    return this.activeLoop.agents[idx];
  }

  shouldEscalate(): boolean {
    if (!this.activeLoop) return false;
    return this.activeLoop.iteration > 2; // Trigger web research after 2 iterations
  }

  endLoop(): void { this.activeLoop = null; }

  getLoopInfo(loopId: LoopId): LoopDefinition | undefined { return LOOPS[loopId]; }

  static getAllLoops(): LoopDefinition[] { return Object.values(LOOPS); }
}
