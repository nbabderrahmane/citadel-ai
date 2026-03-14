export const INTERNAL_DIR = '.citadel';
export const STATE_DIR = '.citadel/state';
export const GATES_DIR = '.citadel/gates';
export const AGENTS_DIR = '.citadel/agents';
export const TEAMS_DIR = '.citadel/teams';
export const SKILLS_DIR = '.citadel/skills';
export const PROJECT_HUB_DIR = 'citadel';
export const PROJECT_SPECS_DIR = 'citadel/specs';

export const HUB_FILES = {
  status: 'STATUS.md',
  context: 'CONTEXT.md',
  sessionLog: 'SESSION_LOG.md',
  decisions: 'DECISIONS.md',
  codebase: 'CODEBASE.md',
  architecture: 'ARCHITECTURE.md',
  tokens: 'TOKENS.md',
  runbook: 'RUNBOOK.md',
  changelog: 'CHANGELOG.md',
  handoff: 'HANDOFF.md',
  gettingStarted: 'GETTING_STARTED.md',
} as const;

export const HUB_FILE_COUNT = Object.keys(HUB_FILES).length;
