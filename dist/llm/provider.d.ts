import type { LLMConfig, LLMMessage, LLMResponse } from '../core/types.js';
export interface ILLMProvider {
    chat(messages: LLMMessage[], options?: {
        maxTokens?: number;
        temperature?: number;
    }): Promise<LLMResponse>;
}
export declare function createLLMProvider(config: LLMConfig): ILLMProvider;
