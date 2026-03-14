// ═══════════════════════════════════════════════════════════════
// CITADEL — Orchestrator (ATLAS Brain)
// ═══════════════════════════════════════════════════════════════
import { Memory } from './memory.js';
import { GateSystem } from './gates.js';
import { LoopManager } from './loops.js';
import { createLLMProvider } from '../llm/provider.js';
import { getAgent, AGENT_REGISTRY } from '../agents/registry.js';
// ── Phase Flow ──
const PHASE_ORDER = ['inception', 'specification', 'architecture', 'build', 'validation', 'ship'];
const PHASE_GATES = {
    inception: 'gate-0',
    specification: 'gate-1',
    architecture: 'gate-2',
    build: 'gate-3',
    validation: 'gate-3',
    ship: 'gate-4',
};
const PHASE_AGENTS = {
    inception: ['atlas', 'marty', 'linus', 'bruce', 'sean', 'monica'],
    specification: ['marty', 'teresa', 'strunk', 'jony'],
    architecture: ['linus', 'codd', 'bruce', 'kelsey', 'harrison', 'alex', 'grace', 'charity'],
    build: ['atlas', 'linus', 'jony', 'uncle-bob', 'dan', 'steipete', 'filippo', 'moxie', 'max', 'dj-patil', 'cyrus', 'chamath', 'karpathy', 'grace', 'charity', 'rich'],
    validation: ['atlas', 'linus', 'bruce', 'guido', 'kent', 'brendan', 'jakob', 'razor', 'lisa', 'nate', 'aleyda', 'peep', 'charlie', 'window', 'date', 'deming', 'flyway', 'aaron', 'trail'],
    ship: ['kelsey', 'bruce', 'atlas'],
};
// ── Help / stuck detection (multilingual) ──
const HELP_PATTERNS = [
    /\bhelp\b/i, /\bstuck\b/i, /\bconfused\b/i, /\blost\b/i,
    /\baide\b/i, /\bbloqué\b/i, /\bperdu\b/i,
    /\bayuda\b/i, /\batascado\b/i,
    /\bhilfe\b/i, /\bfest\b/i,
    /مساعدة/, /مشكل/,
    /\bwhat now\b/i, /\bwhat do i do\b/i, /\bwhere am i\b/i,
    /\bnext\s*step\b/i, /\bque faire\b/i,
];
const COLLABORATIVE_PATTERNS = [
    /\bbuild\b/i, /\bimplement\b/i, /\bcreate\b/i, /\badd\b/i, /\bfix\b/i, /\brefactor\b/i,
    /\bfrontend\b/i, /\bbackend\b/i, /\bdesign\b/i, /\bui\b/i, /\bux\b/i, /\bapi\b/i,
    /\breview\b/i, /\bvalidate\b/i, /\bchecker\b/i, /\bplan\b/i,
];
export class Orchestrator {
    config;
    memory;
    gates;
    loops;
    llm;
    totalTokens = 0;
    constructor(config) {
        this.config = config;
        this.memory = new Memory(config.projectPath);
        this.gates = new GateSystem(config.projectPath);
        this.loops = new LoopManager();
        this.llm = createLLMProvider(config.llm);
        this.totalTokens = this.memory.getTokenSummary()?.used ?? 0;
    }
    getMemory() { return this.memory; }
    getGates() { return this.gates; }
    getTotalTokens() { return this.totalTokens; }
    // ═══ Main Entry Point ═══
    async processMessage(userMessage) {
        const session = this.memory.getSession() ?? this.memory.initSession();
        // Store user message
        this.memory.addMessage({
            role: 'user', content: userMessage,
            phase: session.currentPhase, gate: session.currentGate,
        });
        // Detect help/stuck
        if (this.isHelpRequest(userMessage)) {
            return this.handleHelp();
        }
        if (this.shouldUseCollaborativeResponse(userMessage, session.currentPhase)) {
            this.memory.setActiveAgent('atlas');
            const collaborative = await this.processCollaborativeMessage(userMessage, session.currentPhase);
            this.memory.addMessage({
                role: 'agent', agent: 'atlas', content: collaborative,
                phase: session.currentPhase, gate: session.currentGate,
            });
            return collaborative;
        }
        // Route to appropriate agent based on phase
        const agentId = this.routeMessage(userMessage, session.currentPhase);
        const agent = getAgent(agentId);
        if (!agent)
            return this.handleHelp();
        this.memory.setActiveAgent(agentId);
        // Build context-aware prompt
        const messages = this.buildPrompt(agent.id, userMessage);
        // Call LLM
        const response = await this.llm.chat(messages);
        this.totalTokens += response.tokensUsed;
        this.memory.recordTokenUsage(agentId, response.tokensUsed, response.model);
        // Format response with agent identity
        const formatted = this.formatResponse(agent.icon, agent.name, agent.title, response.content);
        // Store agent response
        this.memory.addMessage({
            role: 'agent', agent: agentId, content: response.content,
            phase: session.currentPhase, gate: session.currentGate,
        });
        return formatted;
    }
    // ═══ Phase Advancement ═══
    async advancePhase() {
        const session = this.memory.getSession();
        if (!session)
            return '❌ No active session.';
        const currentGate = PHASE_GATES[session.currentPhase];
        const { allowed, blockers } = this.gates.canProceed(currentGate);
        if (!allowed) {
            let msg = `\n🚧 Cannot advance — gate ${currentGate} not passed:\n`;
            for (const b of blockers)
                msg += `  ⛔ ${b}\n`;
            msg += `\nComplete the checks above first.`;
            return msg;
        }
        const idx = PHASE_ORDER.indexOf(session.currentPhase);
        if (idx >= PHASE_ORDER.length - 1)
            return '🎉 All phases complete! Project is shipped.';
        const nextPhase = PHASE_ORDER[idx + 1];
        this.memory.setPhase(nextPhase);
        this.memory.setGate(PHASE_GATES[nextPhase]);
        const agents = PHASE_AGENTS[nextPhase];
        const agentNames = agents.map(id => {
            const a = getAgent(id);
            return a ? `${a.icon} ${a.name}` : id;
        }).join(', ');
        return `\n✅ Advanced to: ${nextPhase.toUpperCase()}\n📍 Gate: ${PHASE_GATES[nextPhase]}\n👥 Active agents: ${agentNames}\n\nWhat would you like to work on?`;
    }
    // ═══ Routing Logic ═══
    routeMessage(message, phase) {
        const lower = message.toLowerCase();
        const available = PHASE_AGENTS[phase] ?? ['atlas'];
        // Direct agent mentions
        for (const [id, agent] of AGENT_REGISTRY) {
            if (lower.includes(agent.name.toLowerCase()) || lower.includes(`@${id}`)) {
                if (available.includes(id))
                    return id;
            }
        }
        // Keyword routing
        const keywords = {
            'linus': ['architecture', 'tech stack', 'adr', 'technical', 'framework', 'typescript', 'backend vs frontend'],
            'marty': ['product', 'feature', 'user story', 'prd', 'requirement', 'scope', 'mvp', 'user need'],
            'sean': ['growth', 'analytics', 'seo', 'conversion', 'funnel', 'metric', 'kpi'],
            'bruce': ['security', 'auth', 'vulnerability', 'encrypt', 'password', 'token', 'owasp'],
            'monica': ['data', 'database', 'schema', 'migration', 'model', 'ai', 'ml'],
            'uncle-bob': ['backend', 'api', 'endpoint', 'server', 'service', 'controller', 'route'],
            'dan': ['frontend', 'component', 'react', 'ui', 'css', 'page', 'layout', 'form'],
            'steipete': ['mobile', 'ios', 'android', 'swift', 'kotlin', 'app', 'native'],
            'kelsey': ['deploy', 'docker', 'ci', 'cd', 'infrastructure', 'devops', 'monitor'],
            'jony': ['design', 'ux', 'wireframe', 'interface', 'user experience'],
            'filippo': ['login', 'signup', 'authentication', 'oauth', 'session', 'jwt'],
            'codd': ['table', 'column', 'index', 'normalize', 'relation', 'foreign key', 'sql'],
            'karpathy': ['prompt', 'llm', 'chatbot', 'ai model', 'gpt', 'claude', 'embedding'],
            'harrison': ['agent', 'multi-agent', 'tool use', 'mcp', 'langchain', 'agentic'],
            'alex': ['integration', 'mcp server', 'external api', 'webhook', 'transport'],
            'kent': ['test', 'coverage', 'tdd', 'unit test', 'integration test'],
            'guido': ['review', 'code quality', 'refactor', 'clean code'],
            'charlie': ['pentest', 'hack', 'exploit', 'vulnerability scan'],
            'grace': ['api', 'rest', 'graphql', 'endpoint', 'openapi', 'swagger', 'contract'],
            'charity': ['observability', 'logging', 'tracing', 'monitoring', 'dashboard', 'alert', 'sli', 'slo'],
            'rich': ['documentation', 'docs', 'readme', 'tutorial', 'how-to', 'guide'],
            'aaron': ['accessibility', 'a11y', 'wcag', 'screen reader', 'keyboard nav', 'aria'],
            'trail': ['audit', 'audit trail', 'compliance log', 'retention'],
        };
        for (const [agentId, words] of Object.entries(keywords)) {
            if (available.includes(agentId) && words.some(w => lower.includes(w))) {
                return agentId;
            }
        }
        // Default to first available agent or atlas
        return available[0] ?? 'atlas';
    }
    shouldUseCollaborativeResponse(message, phase) {
        if (phase === 'inception' || this.hasDirectAgentMention(message)) {
            return false;
        }
        if (phase === 'architecture' || phase === 'build' || phase === 'validation' || phase === 'ship') {
            return true;
        }
        return COLLABORATIVE_PATTERNS.some(pattern => pattern.test(message));
    }
    // ═══ Prompt Builder ═══
    buildPrompt(agentId, userMessage) {
        const agent = getAgent(agentId);
        if (!agent)
            return [{ role: 'user', content: userMessage }];
        const context = this.memory.buildContext();
        const session = this.memory.getSession();
        // Build system prompt with agent personality + rules + context
        let system = agent.systemPrompt + '\n\n';
        system += '## YOUR RULES (IMMUTABLE)\n';
        for (const rule of agent.rules)
            system += `- ${rule}\n`;
        system += '\n## YOUR PRINCIPLES\n';
        for (const p of agent.principles)
            system += `- ${p}\n`;
        // Chinese Wall enforcement for checkers
        if (agent.level === 'checker') {
            system += '\n## CHINESE WALL ENFORCEMENT\n';
            system += 'You are a CHECKER. You NEVER wrote or built the work you are reviewing.\n';
            system += 'You provide independent, unbiased review. If you detect that you are being asked to review your own work, REFUSE.\n';
        }
        system += '\n' + context;
        // Recent conversation for continuity
        const messages = [{ role: 'system', content: system }];
        if (session) {
            const recent = session.conversationHistory.slice(-4);
            for (const msg of recent) {
                if (msg.role === 'user') {
                    messages.push({ role: 'user', content: msg.content });
                }
                else if (msg.role === 'agent') {
                    messages.push({ role: 'assistant', content: msg.content });
                }
            }
        }
        messages.push({ role: 'user', content: userMessage });
        return messages;
    }
    async processCollaborativeMessage(userMessage, phase) {
        const panel = this.selectCollaborativePanel(userMessage);
        const messages = this.buildCollaborativePrompt(panel, phase, userMessage);
        const response = await this.llm.chat(messages);
        this.totalTokens += response.tokensUsed;
        this.memory.recordTokenUsage('atlas', response.tokensUsed, response.model);
        return this.formatResponse('⚡', 'ATLAS', `${panel.name} Lead`, response.content);
    }
    selectCollaborativePanel(message) {
        const lower = message.toLowerCase();
        const isFrontend = ['frontend', 'ui', 'ux', 'design', 'component', 'page', 'layout', 'css', 'react'].some(word => lower.includes(word));
        const isMobile = ['mobile', 'ios', 'android', 'pwa', 'native'].some(word => lower.includes(word));
        const isSecuritySensitive = ['auth', 'login', 'signup', 'password', 'token', 'oauth', 'session', 'jwt', 'security'].some(word => lower.includes(word));
        if (isFrontend) {
            return {
                name: 'Frontend Pod',
                makers: ['jony', 'dan'],
                reviewers: ['guido', 'lisa', 'aaron', ...(isSecuritySensitive ? ['bruce'] : [])],
            };
        }
        if (isMobile) {
            return {
                name: 'Mobile Pod',
                makers: ['jony', 'steipete'],
                reviewers: ['lisa', 'aaron', 'brendan', ...(isSecuritySensitive ? ['bruce'] : [])],
            };
        }
        return {
            name: 'Backend Pod',
            makers: ['uncle-bob', 'codd'],
            reviewers: ['guido', 'kent', 'charlie', ...(isSecuritySensitive ? ['bruce'] : [])],
        };
    }
    buildCollaborativePrompt(panel, phase, userMessage) {
        const session = this.memory.getSession();
        const context = this.memory.buildContext();
        const panelAgents = ['atlas', 'linus', ...panel.makers, ...panel.reviewers]
            .map(id => getAgent(id))
            .filter((agent) => Boolean(agent));
        let system = `You are ATLAS orchestrating the ${panel.name} for CITADEL.\n`;
        system += 'You must run an internal delivery flow before answering the user.\n';
        system += 'Required order: implementation plan -> maker debate -> checker review -> CTO coherence verdict -> final answer.\n';
        system += 'Makers do not speak as final authority before the checkers and LINUS have done their work.\n';
        system += 'If UI is involved, design quality is a first-class concern, not an afterthought.\n';
        system += 'If a reviewer finds a meaningful risk, surface it plainly.\n';
        system += 'If the task is blocked by missing product information, ask only the minimum targeted questions.\n';
        system += '\n## PANEL\n';
        for (const agent of panelAgents) {
            const topRules = agent.rules.slice(0, 3).map(rule => `- ${rule}`).join('\n');
            system += `### ${agent.icon} ${agent.name} (${agent.title})\n`;
            system += `${agent.philosophy}\n${topRules}\n\n`;
        }
        system += `## CURRENT PHASE\n${phase}\n\n`;
        system += `${context}\n`;
        system += `## RESPONSE FORMAT
## Plan
- LINUS writes the implementation plan.

## Debate
- Summarize real tradeoffs or disagreements between agents.

## Checker Flags
- Summarize reviewer findings before any conclusion.

## CTO Verdict
- LINUS states safe / risky / blocked and why.

## Final Answer
- ATLAS gives the consolidated next step for the user.
`;
        const messages = [{ role: 'system', content: system }];
        if (session) {
            const recent = session.conversationHistory.slice(-3);
            for (const msg of recent) {
                if (msg.role === 'user') {
                    messages.push({ role: 'user', content: msg.content });
                }
                else if (msg.role === 'agent') {
                    messages.push({ role: 'assistant', content: msg.content });
                }
            }
        }
        messages.push({ role: 'user', content: userMessage });
        return messages;
    }
    // ═══ Help Handler ═══
    isHelpRequest(message) {
        return HELP_PATTERNS.some(p => p.test(message));
    }
    hasDirectAgentMention(message) {
        const lower = message.toLowerCase();
        for (const [id, agent] of AGENT_REGISTRY) {
            if (lower.includes(`@${id}`) || lower.includes(agent.name.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    handleHelp() {
        const session = this.memory.getSession();
        if (!session)
            return '🏰 Welcome to CITADEL! Run `citadel init` to start.';
        const phase = session.currentPhase;
        const gate = PHASE_GATES[phase];
        const progress = this.gates.getProgressSummary(gate);
        const tokens = this.memory.getTokenSummary();
        const agents = PHASE_AGENTS[phase].map(id => {
            const a = getAgent(id);
            return a ? `  ${a.icon} ${a.name} — ${a.title}` : `  ${id}`;
        }).join('\n');
        return `
🏰 CITADEL — Status

📍 Phase: ${phase.toUpperCase()}
🚧 Gate: ${gate}
${progress}
${tokens ? `\n🧮 Tokens: ${tokens.used.toLocaleString()} / ${tokens.limit.toLocaleString()} (${tokens.level}, ${tokens.status})\n   Advice: ${tokens.advice}\n` : ''}

👥 Active agents:
${agents}

💡 What you can do:
• Describe what you want to build
• Ask a specific question (I'll route to the right expert)
• Type "status" to see gate progress
• Type "estimate [task]" to check context pressure before a heavy turn
• Type "advance" to move to next phase
• Mention an agent by name (@linus, @bruce, etc.)
`;
    }
    // ═══ Response Formatter ═══
    formatResponse(icon, name, title, content) {
        return `\n${icon} ${name} (${title}):\n${content}\n`;
    }
}
//# sourceMappingURL=orchestrator.js.map