import { TokenBucket } from "./token-bucket";
import { TokenBucketStorage } from "./storage/token-bucket-storage";

interface RateLimitConfig {
  capacity: number;
  refillRate: number; // tokens per second
}

export class RateLimiter {
  constructor(
    private config: RateLimitConfig,
    private storage: TokenBucketStorage,
  ) {}

  async allowRequest(identifier: string): Promise<boolean> {
    const bucket = new TokenBucket(this.storage, identifier, this.config);

    return bucket.consume(1);
  }
}
