import type { TeamId } from '../core/types.js';
export interface WallViolation {
    maker: string;
    checker: string;
    team: string;
    reason: string;
}
export declare class ChineseWall {
    /**
     * Check if a checker agent can review work produced by a maker agent.
     * Rule: A checker CANNOT be the same agent that produced the work.
     * In practice, since makers and checkers are different agents, this validates
     * that the checker is indeed from the checker pool, not the maker pool.
     */
    static canReview(makerId: string, checkerId: string): {
        allowed: boolean;
        violation?: WallViolation;
    };
    /**
     * Get valid checkers for a given maker's work.
     */
    static getValidCheckers(makerId: string): string[];
    /**
     * Get valid makers for a team (cannot be checkers).
     */
    static getValidMakers(team: TeamId): string[];
    /**
     * Validate an entire review assignment.
     */
    static validateReviewChain(assignments: Array<{
        maker: string;
        checker: string;
    }>): WallViolation[];
}
