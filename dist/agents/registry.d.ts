import type { AgentDefinition, AgentLevel, TeamId } from '../core/types.js';
export declare const AGENT_REGISTRY: Map<string, AgentDefinition>;
export declare function getAgent(id: string): AgentDefinition | undefined;
export declare function getAgentsByTeam(team: TeamId | 'command'): AgentDefinition[];
export declare function getAgentsByLevel(level: AgentLevel): AgentDefinition[];
export declare function getMakersByTeam(team: TeamId): AgentDefinition[];
export declare function getCheckersByTeam(team: TeamId): AgentDefinition[];
export declare function getCSuiteAgents(): AgentDefinition[];
export declare function getAllAgentIds(): string[];
export declare function getAgentCount(): {
    total: number;
    command: number;
    csuite: number;
    makers: number;
    checkers: number;
};
