import { sleep } from '@nexora/shared';

import {
  type AIProvider,
  type CompletionOptions,
  type CompletionResult,
  type StreamCallback,
  type AIError,
} from './types.js';
import { OpenAIProvider } from './providers/openai.provider.js';
import { AnthropicProvider } from './providers/anthropic.provider.js';
import { GeminiProvider } from './providers/gemini.provider.js';

export type ProviderName = 'openai' | 'anthropic' | 'gemini';

interface OrchestratorOptions {
  defaultProvider?: ProviderName;
  fallbackProviders?: ProviderName[];
  maxRetries?: number;
  retryDelay?: number;
}

interface OrchestratedCompletionOptions extends CompletionOptions {
  provider?: ProviderName;
  stream?: boolean;
  onChunk?: StreamCallback;
}

export class AIOrchestrator {
  private readonly providers: Map<ProviderName, AIProvider>;
  private readonly defaultProvider: ProviderName;
  private readonly fallbackProviders: ProviderName[];
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(options: OrchestratorOptions = {}) {
    this.defaultProvider = options.defaultProvider ?? 'openai';
    this.fallbackProviders = options.fallbackProviders ?? ['anthropic', 'gemini'];
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;

    this.providers = new Map<ProviderName, AIProvider>([
      ['openai', new OpenAIProvider()],
      ['anthropic', new AnthropicProvider()],
      ['gemini', new GeminiProvider()],
    ]);
  }

  private getProvider(name: ProviderName): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Unknown provider: ${name}`);
    }
    return provider;
  }

  private async executeWithRetry(
    provider: AIProvider,
    options: CompletionOptions,
    onChunk?: StreamCallback,
  ): Promise<CompletionResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        if (onChunk) {
          return await provider.stream(options, onChunk);
        }
        return await provider.complete(options);
      } catch (error) {
        lastError = error;
        const aiError = error as AIError;

        if (!aiError.retryable) {
          throw error;
        }

        if (attempt < this.maxRetries - 1) {
          await sleep(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  async complete(options: OrchestratedCompletionOptions): Promise<CompletionResult> {
    const providerName = options.provider ?? this.defaultProvider;
    const tryOrder: ProviderName[] = [
      providerName,
      ...this.fallbackProviders.filter((p) => p !== providerName),
    ];

    let lastError: unknown;

    for (const name of tryOrder) {
      const provider = this.getProvider(name);
      if (!provider.isAvailable()) continue;

      try {
        return await this.executeWithRetry(provider, options, options.onChunk);
      } catch (error) {
        lastError = error;
        const aiError = error as AIError;
        // Only try next provider if the error suggests the provider is down/rate-limited
        if (!aiError.retryable) {
          throw error;
        }
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  getAvailableProviders(): ProviderName[] {
    return Array.from(this.providers.entries())
      .filter(([, provider]) => provider.isAvailable())
      .map(([name]) => name);
  }
}
