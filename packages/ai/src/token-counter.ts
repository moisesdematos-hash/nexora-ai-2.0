// Token counting utility using tiktoken
// For models without exact token counts, we use approximations

const AVERAGE_CHARS_PER_TOKEN = 4;

export class TokenCounter {
  /**
   * Estimates token count for a given text.
   * Uses a simple heuristic: ~4 chars per token for most LLMs.
   */
  estimateTokens(text: string): number {
    // Better estimation: count words and punctuation
    const words = text.split(/\s+/).filter(Boolean);
    const chars = text.length;

    // Blend word count and char count for better accuracy
    const wordBasedEstimate = Math.ceil(words.length * 1.3);
    const charBasedEstimate = Math.ceil(chars / AVERAGE_CHARS_PER_TOKEN);

    return Math.max(wordBasedEstimate, charBasedEstimate);
  }

  /**
   * Estimates tokens for a full conversation.
   */
  estimateConversationTokens(
    messages: Array<{ role: string; content: string }>,
  ): number {
    // OpenAI adds overhead per message: ~4 tokens per message + 3 tokens for reply priming
    const messageOverhead = messages.length * 4 + 3;
    const contentTokens = messages.reduce(
      (sum, msg) => sum + this.estimateTokens(msg.content),
      0,
    );
    return contentTokens + messageOverhead;
  }

  /**
   * Checks if a conversation fits within a context window.
   */
  fitsInContext(
    messages: Array<{ role: string; content: string }>,
    maxContextTokens: number,
    reserveForOutput = 1000,
  ): boolean {
    const estimatedTokens = this.estimateConversationTokens(messages);
    return estimatedTokens + reserveForOutput <= maxContextTokens;
  }

  /**
   * Truncates messages to fit within a context window.
   */
  truncateToFit(
    messages: Array<{ role: string; content: string }>,
    maxContextTokens: number,
    reserveForOutput = 1000,
  ): Array<{ role: string; content: string }> {
    const available = maxContextTokens - reserveForOutput;
    const result = [...messages];

    while (result.length > 1 && this.estimateConversationTokens(result) > available) {
      // Remove the oldest non-system message
      const systemIdx = result.findIndex((m) => m.role === 'system');
      const removeIdx = systemIdx === 0 ? 1 : 0;
      result.splice(removeIdx, 1);
    }

    return result;
  }
}
