// Cost per 1000 tokens in USD (approximate, as of 2024)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-3-5-haiku-20241022': { input: 0.001, output: 0.005 },
  'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-flash-8b': { input: 0.0000375, output: 0.00015 },
};

const DEFAULT_COST = { input: 0.002, output: 0.008 };

export interface CostEstimate {
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
  model: string;
  tokensInput: number;
  tokensOutput: number;
}

export class CostEstimator {
  /**
   * Estimates cost in USD for a given model and token counts.
   */
  estimate(model: string, inputTokens: number, outputTokens: number): CostEstimate {
    const costs = MODEL_COSTS[model] ?? DEFAULT_COST;

    const inputCostUsd = (inputTokens / 1000) * costs.input;
    const outputCostUsd = (outputTokens / 1000) * costs.output;

    return {
      inputCostUsd,
      outputCostUsd,
      totalCostUsd: inputCostUsd + outputCostUsd,
      model,
      tokensInput: inputTokens,
      tokensOutput: outputTokens,
    };
  }

  /**
   * Formats cost as a human-readable string.
   */
  formatCost(costUsd: number): string {
    if (costUsd < 0.001) {
      return `$${(costUsd * 1000).toFixed(4)}m`; // millicents
    }
    return `$${costUsd.toFixed(6)}`;
  }

  /**
   * Returns the cost per 1000 tokens for a model.
   */
  getModelCosts(model: string): { input: number; output: number } {
    return MODEL_COSTS[model] ?? DEFAULT_COST;
  }

  /**
   * Lists all known models with their costs.
   */
  listModelCosts(): Record<string, { input: number; output: number }> {
    return { ...MODEL_COSTS };
  }
}
