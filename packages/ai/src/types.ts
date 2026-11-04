// ============================================================
// AI Provider Interface & Types
// ============================================================

export interface CompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  model: string;
  messages: CompletionMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  responseFormat?: { type: 'json_object' | 'text' };
}

export interface CompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export type StreamCallback = (chunk: StreamChunk) => void | Promise<void>;

export interface AIProvider {
  name: string;
  complete(options: CompletionOptions): Promise<CompletionResult>;
  stream(options: CompletionOptions, onChunk: StreamCallback): Promise<CompletionResult>;
  isAvailable(): boolean;
  getSupportedModels(): string[];
}

export interface AIError extends Error {
  code: string;
  provider: string;
  retryable: boolean;
  statusCode?: number;
}

export function createAIError(
  message: string,
  code: string,
  provider: string,
  retryable = false,
  statusCode?: number,
): AIError {
  const error = new Error(message) as AIError;
  error.code = code;
  error.provider = provider;
  error.retryable = retryable;
  error.statusCode = statusCode;
  return error;
}
