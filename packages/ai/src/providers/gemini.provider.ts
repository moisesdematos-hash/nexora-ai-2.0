import { GoogleGenerativeAI, type Content } from '@google/generative-ai';

import {
  type AIProvider,
  type CompletionOptions,
  type CompletionResult,
  type StreamCallback,
  createAIError,
} from '../types.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  private readonly client: GoogleGenerativeAI;
  private readonly supportedModels = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-exp',
  ];

  constructor(apiKey?: string) {
    this.client = new GoogleGenerativeAI(
      apiKey ?? process.env['GOOGLE_AI_API_KEY'] ?? '',
    );
  }

  isAvailable(): boolean {
    return !!process.env['GOOGLE_AI_API_KEY'];
  }

  getSupportedModels(): string[] {
    return this.supportedModels;
  }

  private buildHistory(options: CompletionOptions): {
    systemInstruction: string | undefined;
    history: Content[];
    lastUserMessage: string;
  } {
    const systemMsg = options.messages.find((m) => m.role === 'system');
    const conversation = options.messages.filter((m) => m.role !== 'system');

    const history: Content[] = conversation.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMsg = conversation[conversation.length - 1];
    const lastUserMessage = lastMsg?.content ?? '';

    return {
      systemInstruction: systemMsg?.content,
      history,
      lastUserMessage,
    };
  }

  async complete(options: CompletionOptions): Promise<CompletionResult> {
    try {
      const { systemInstruction, history, lastUserMessage } = this.buildHistory(options);

      const genModel = this.client.getGenerativeModel({
        model: options.model,
        systemInstruction,
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? 4096,
          temperature: options.temperature ?? 0.7,
          topP: options.topP,
          stopSequences: options.stop,
        },
      });

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessage(lastUserMessage);
      const response = result.response;

      const text = response.text();
      const usage = response.usageMetadata;

      return {
        content: text,
        model: options.model,
        usage: {
          promptTokens: usage?.promptTokenCount ?? 0,
          completionTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
        },
        finishReason: response.candidates?.[0]?.finishReason ?? 'STOP',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw createAIError(error.message, 'GEMINI_ERROR', this.name, true);
      }
      throw error;
    }
  }

  async stream(options: CompletionOptions, onChunk: StreamCallback): Promise<CompletionResult> {
    try {
      const { systemInstruction, history, lastUserMessage } = this.buildHistory(options);

      const genModel = this.client.getGenerativeModel({
        model: options.model,
        systemInstruction,
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? 4096,
          temperature: options.temperature ?? 0.7,
          topP: options.topP,
        },
      });

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessageStream(lastUserMessage);

      let fullContent = '';
      let finalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullContent += text;
        await onChunk({ content: text, done: false });

        const usage = chunk.usageMetadata;
        if (usage) {
          finalUsage = {
            promptTokens: usage.promptTokenCount ?? 0,
            completionTokens: usage.candidatesTokenCount ?? 0,
            totalTokens: usage.totalTokenCount ?? 0,
          };
        }
      }

      await onChunk({ content: '', done: true });

      return {
        content: fullContent,
        model: options.model,
        usage: finalUsage,
        finishReason: 'STOP',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw createAIError(error.message, 'GEMINI_ERROR', this.name, true);
      }
      throw error;
    }
  }
}
