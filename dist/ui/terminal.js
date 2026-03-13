// ═══════════════════════════════════════════════════════════════
// CITADEL — Terminal UI
// ═══════════════════════════════════════════════════════════════
import { getAgentCount } from '../agents/registry.js';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
export function banner() {
    const c = getAgentCount();
    return `
${BOLD}${CYAN}
   ██████╗██╗████████╗ █████╗ ██████╗ ███████╗██╗     
  ██╔════╝██║╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║     
  ██║     ██║   ██║   ███████║██║  ██║█████╗  ██║     
  ██║     ██║   ██║   ██╔══██║██║  ██║██╔══╝  ██║     
  ╚██████╗██║   ██║   ██║  ██║██████╔╝███████╗███████╗
   ╚═════╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
${RESET}
  ${DIM}Command Intelligence Tower for Architected Development${RESET}
  ${DIM}with Enforced Layers${RESET}

  ${YELLOW}${c.total} agents${RESET} ${DIM}|${RESET} ${CYAN}${c.command} command${RESET} ${DIM}|${RESET} ${MAGENTA}${c.csuite} c-suite${RESET} ${DIM}|${RESET} ${GREEN}${c.makers} makers${RESET} ${DIM}|${RESET} ${BLUE}${c.checkers} checkers${RESET}
  ${DIM}Maker ≠ Checker (Chinese Wall enforced)${RESET}
  ${RED}CISO has absolute veto power${RESET}
`;
}
export function divider() {
    return `${DIM}${'═'.repeat(60)}${RESET}\n`;
}
export function agentHeader(icon, name, title) {
    return `\n${BOLD}${icon} ${name}${RESET} ${DIM}(${title})${RESET}\n`;
}
export function gateStatus(name, passed, total, status) {
    const color = status === 'passed' ? GREEN : status === 'failed' ? RED : YELLOW;
    return `${color}🚧 ${name} — ${passed}/${total} (${status})${RESET}`;
}
export function success(msg) { return `${GREEN}✅ ${msg}${RESET}`; }
export function error(msg) { return `${RED}❌ ${msg}${RESET}`; }
export function warning(msg) { return `${YELLOW}⚠️  ${msg}${RESET}`; }
export function info(msg) { return `${CYAN}ℹ️  ${msg}${RESET}`; }
export async function loadUI() {
    // Terminal ANSI codes are used directly — no external deps needed
}
// ── Spinner for async operations ──
export class Spinner {
    frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    interval = null;
    i = 0;
    start(msg) {
        this.i = 0;
        this.interval = setInterval(() => {
            process.stdout.write(`\r${CYAN}${this.frames[this.i % this.frames.length]}${RESET} ${msg}`);
            this.i++;
        }, 80);
    }
    stop(msg) {
        if (this.interval)
            clearInterval(this.interval);
        process.stdout.write(`\r${' '.repeat(60)}\r`);
        if (msg)
            console.log(msg);
    }
}
//# sourceMappingURL=terminal.js.map