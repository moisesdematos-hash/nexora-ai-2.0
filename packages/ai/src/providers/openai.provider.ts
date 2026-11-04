import OpenAI from 'openai';

import {
  type AIProvider,
  type CompletionOptions,
  type CompletionResult,
  type StreamCallback,
  createAIError,
} from '../types.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  private readonly client: OpenAI;
  private readonly supportedModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ];

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey ?? process.env['OPENAI_API_KEY'],
    });
  }

  isAvailable(): boolean {
    return !!(process.env['OPENAI_API_KEY'] || this.client.apiKey);
  }

  getSupportedModels(): string[] {
    return this.supportedModels;
  }

  async complete(options: CompletionOptions): Promise<CompletionResult> {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model,
        messages: options.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stop,
        response_format: options.responseFormat,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw createAIError('No completion returned', 'NO_COMPLETION', this.name);
      }

      return {
        content: choice.message.content ?? '',
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
        finishReason: choice.finish_reason ?? 'stop',
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw createAIError(
          error.message,
          `OPENAI_${error.status ?? 'ERROR'}`,
          this.name,
          error.status === 429 || (error.status ?? 0) >= 500,
          error.status,
        );
      }
      throw error;
    }
  }

  async stream(options: CompletionOptions, onChunk: StreamCallback): Promise<CompletionResult> {
    try {
      const stream = await this.client.chat.completions.create({
        ...options,
        messages: options.messages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
        stream: true,
      });

      let fullContent = '';
      let totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        fullContent += delta;
        await onChunk({ content: delta, done: false });

        if (chunk.usage) {
          totalUsage = {
            promptTokens: chunk.usage.prompt_tokens,
            completionTokens: chunk.usage.completion_tokens,
            totalTokens: chunk.usage.total_tokens,
          };
        }
      }

      await onChunk({ content: '', done: true });

      return {
        content: fullContent,
        model: options.model,
        usage: totalUsage,
        finishReason: 'stop',
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw createAIError(
          error.message,
          `OPENAI_${error.status ?? 'ERROR'}`,
          this.name,
          error.status === 429 || (error.status ?? 0) >= 500,
          error.status,
        );
      }
      throw error;
    }
  }
}
