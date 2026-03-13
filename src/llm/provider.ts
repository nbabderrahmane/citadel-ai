// ═══════════════════════════════════════════════════════════════
// CITADEL — LLM Provider Abstraction
// ═══════════════════════════════════════════════════════════════

import type { LLMConfig, LLMMessage, LLMResponse } from '../core/types.js';

export interface ILLMProvider {
  chat(messages: LLMMessage[], options?: { maxTokens?: number; temperature?: number }): Promise<LLMResponse>;
}

// ── Anthropic (Claude) ──
class AnthropicProvider implements ILLMProvider {
  private apiKey: string;
  private model: string;
  private defaults: { maxTokens: number; temperature: number };

  constructor(config: LLMConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.defaults = { maxTokens: config.maxTokens, temperature: config.temperature };
  }

  async chat(messages: LLMMessage[], options?: { maxTokens?: number; temperature?: number }): Promise<LLMResponse> {
    const sys = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const msgs = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? this.defaults.maxTokens,
        temperature: options?.temperature ?? this.defaults.temperature,
        system: sys || undefined,
        messages: msgs,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${err}`);
    }

    const data = await res.json() as any;
    const content = data.content?.map((c: any) => c.text || '').join('') ?? '';
    const tokensUsed = (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0);

    return { content, tokensUsed, model: data.model ?? this.model };
  }
}

// ── OpenAI ──
class OpenAIProvider implements ILLMProvider {
  private apiKey: string;
  private model: string;
  private defaults: { maxTokens: number; temperature: number };

  constructor(config: LLMConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.defaults = { maxTokens: config.maxTokens, temperature: config.temperature };
  }

  async chat(messages: LLMMessage[], options?: { maxTokens?: number; temperature?: number }): Promise<LLMResponse> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? this.defaults.maxTokens,
        temperature: options?.temperature ?? this.defaults.temperature,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json() as any;
    const content = data.choices?.[0]?.message?.content ?? '';
    const tokensUsed = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

    return { content, tokensUsed, model: data.model ?? this.model };
  }
}

// ── Factory ──
export function createLLMProvider(config: LLMConfig): ILLMProvider {
  switch (config.provider) {
    case 'anthropic': return new AnthropicProvider(config);
    case 'openai': return new OpenAIProvider(config);
    default: throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}
