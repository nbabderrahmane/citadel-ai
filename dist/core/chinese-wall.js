// ═══════════════════════════════════════════════════════════════
// CITADEL — Chinese Wall Enforcement (Maker ≠ Checker)
// ═══════════════════════════════════════════════════════════════
import { getAgent, getMakersByTeam, getCheckersByTeam } from '../agents/registry.js';
export class ChineseWall {
    /**
     * Check if a checker agent can review work produced by a maker agent.
     * Rule: A checker CANNOT be the same agent that produced the work.
     * In practice, since makers and checkers are different agents, this validates
     * that the checker is indeed from the checker pool, not the maker pool.
     */
    static canReview(makerId, checkerId) {
        const maker = getAgent(makerId);
        const checker = getAgent(checkerId);
        if (!maker || !checker) {
            return { allowed: false, violation: { maker: makerId, checker: checkerId, team: 'unknown', reason: 'Agent not found' } };
        }
        // Same agent cannot review own work
        if (makerId === checkerId) {
            return { allowed: false, violation: { maker: makerId, checker: checkerId, team: maker.team, reason: 'Agent cannot review own work' } };
        }
        // Maker cannot act as checker
        if (checker.level === 'maker') {
            return { allowed: false, violation: { maker: makerId, checker: checkerId, team: checker.team, reason: 'Maker agents cannot act as checkers' } };
        }
        // Checker cannot act as maker
        if (maker.level === 'checker') {
            return { allowed: false, violation: { maker: makerId, checker: checkerId, team: maker.team, reason: 'Checker agents cannot act as makers' } };
        }
        return { allowed: true };
    }
    /**
     * Get valid checkers for a given maker's work.
     */
    static getValidCheckers(makerId) {
        const maker = getAgent(makerId);
        if (!maker || maker.level !== 'maker')
            return [];
        const checkers = getCheckersByTeam(maker.team);
        return checkers.map(c => c.id);
    }
    /**
     * Get valid makers for a team (cannot be checkers).
     */
    static getValidMakers(team) {
        return getMakersByTeam(team).map(m => m.id);
    }
    /**
     * Validate an entire review assignment.
     */
    static validateReviewChain(assignments) {
        const violations = [];
        for (const { maker, checker } of assignments) {
            const result = ChineseWall.canReview(maker, checker);
            if (!result.allowed && result.violation) {
                violations.push(result.violation);
            }
        }
        return violations;
    }
}
//# sourceMappingURL=chinese-wall.js.map