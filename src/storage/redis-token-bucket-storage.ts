import { createClient, RedisClientType } from "redis";
import { TokenBucketStorage, TokenBucketState } from "./token-bucket-storage";
import env from './../utils/validate-env';

export class RedisTokenBucketStorage implements TokenBucketStorage {
  private client: RedisClientType;
  private readonly prefix = "tb:";

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async connectIfNeeded(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async getOrCreate(
    key: string,
    capacity: number,
  ): Promise<TokenBucketState> {
    await this.connectIfNeeded();

    const redisKey = this.getKey(key);
    const data = await this.client.get(redisKey);

    if (data) {
      const parsed = JSON.parse(data) as TokenBucketState;
      return parsed;
    }

    // Create new bucket state
    const initialState: TokenBucketState = {
      tokens: capacity,
      lastRefill: Date.now(),
    };

    await this.client.setEx(
      redisKey,
      env.BUCKET_TTL_SECONDS,
      JSON.stringify(initialState),
    );

    return initialState;
  }

  async update(key: string, state: TokenBucketState): Promise<void> {
    await this.connectIfNeeded();
    const redisKey = this.getKey(key);
    // Keep the same TTL
    await this.client.setEx(
      redisKey,
     env.BUCKET_TTL_SECONDS,
      JSON.stringify(state),
    );
  }

  // Optional: cleanup method / disconnect on shutdown
  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.destroy();
    }
  }
}