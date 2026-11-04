import Anthropic from '@anthropic-ai/sdk';

import {
  type AIProvider,
  type CompletionOptions,
  type CompletionResult,
  type StreamCallback,
  createAIError,
} from '../types.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';

  private readonly client: Anthropic;
  private readonly supportedModels = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-haiku-20240307',
    'claude-3-opus-20240229',
  ];

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey ?? process.env['ANTHROPIC_API_KEY'],
    });
  }

  isAvailable(): boolean {
    return !!process.env['ANTHROPIC_API_KEY'];
  }

  getSupportedModels(): string[] {
    return this.supportedModels;
  }

  private buildMessages(options: CompletionOptions): {
    system: string | undefined;
    messages: Anthropic.MessageParam[];
  } {
    const systemMessage = options.messages.find((m) => m.role === 'system');
    const conversationMessages = options.messages.filter((m) => m.role !== 'system');

    const messages: Anthropic.MessageParam[] = conversationMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    return { system: systemMessage?.content, messages };
  }

  async complete(options: CompletionOptions): Promise<CompletionResult> {
    try {
      const { system, messages } = this.buildMessages(options);

      const response = await this.client.messages.create({
        model: options.model,
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
        system,
        messages,
      });

      const content = response.content[0];
      if (!content || content.type !== 'text') {
        throw createAIError('No text completion returned', 'NO_COMPLETION', this.name);
      }

      return {
        content: content.text,
        model: response.model,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        finishReason: response.stop_reason ?? 'stop',
      };
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw createAIError(
          error.message,
          `ANTHROPIC_${error.status ?? 'ERROR'}`,
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
      const { system, messages } = this.buildMessages(options);

      const stream = this.client.messages.stream({
        model: options.model,
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
        system,
        messages,
      });

      let fullContent = '';

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullContent += event.delta.text;
          await onChunk({ content: event.delta.text, done: false });
        }
      }

      const finalMessage = await stream.finalMessage();
      await onChunk({ content: '', done: true });

      return {
        content: fullContent,
        model: finalMessage.model,
        usage: {
          promptTokens: finalMessage.usage.input_tokens,
          completionTokens: finalMessage.usage.output_tokens,
          totalTokens: finalMessage.usage.input_tokens + finalMessage.usage.output_tokens,
        },
        finishReason: finalMessage.stop_reason ?? 'stop',
      };
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw createAIError(
          error.message,
          `ANTHROPIC_${error.status ?? 'ERROR'}`,
          this.name,
          error.status === 429 || (error.status ?? 0) >= 500,
          error.status,
        );
      }
      throw error;
    }
  }
}
