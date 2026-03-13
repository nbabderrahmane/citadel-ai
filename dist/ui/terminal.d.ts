export declare function banner(): string;
export declare function divider(): string;
export declare function agentHeader(icon: string, name: string, title: string): string;
export declare function gateStatus(name: string, passed: number, total: number, status: string): string;
export declare function success(msg: string): string;
export declare function error(msg: string): string;
export declare function warning(msg: string): string;
export declare function info(msg: string): string;
export declare function loadUI(): Promise<void>;
export declare class Spinner {
    private frames;
    private interval;
    private i;
    start(msg: string): void;
    stop(msg?: string): void;
}
