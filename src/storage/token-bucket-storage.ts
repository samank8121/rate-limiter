export interface TokenBucketStorage {
  getOrCreate(key: string, capacity: number): Promise<TokenBucketState>;
  update(key: string, state: TokenBucketState): Promise<void>;
}

export interface TokenBucketState {
  tokens: number;
  lastRefill: number;
}