import { TokenBucketState, TokenBucketStorage } from "./storage/token-bucket-storage";

export interface TokenBucketOptions {
  capacity: number;
  refillRate: number;
}

export class TokenBucket {
  constructor(
    private storage: TokenBucketStorage,
    private key: string,
    private options: TokenBucketOptions,
  ) {}

  private async getState(): Promise<TokenBucketState> {
    return this.storage.getOrCreate(
      this.key,
      this.options.capacity,
    );
  }

  private async saveState(state: TokenBucketState): Promise<void> {
    await this.storage.update(this.key, state);
  }

  private calculateRefill(state: TokenBucketState): TokenBucketState {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastRefill) / 1000);

    const refillTokens = elapsedSeconds * this.options.refillRate;
    const newTokens = Math.min(
      this.options.capacity,
      state.tokens + refillTokens,
    );

    return {
      tokens: newTokens,
      lastRefill: now,
    };
  }

  async consume(tokensToConsume: number = 1): Promise<boolean> {
    let state = await this.getState();
    state = this.calculateRefill(state);

    if (state.tokens >= tokensToConsume) {
      state.tokens -= tokensToConsume;
      await this.saveState(state);
      return true;
    }
    // Even if denied → we still update the lastRefill timestamp
    await this.saveState(state);
    return false;
  }

  async getTokens(): Promise<number> {
    let state = await this.getState();
    state = this.calculateRefill(state);
    await this.saveState(state); // optional – but keeps lastRefill fresh
    return state.tokens;
  }
}