import env from "../utils/validate-env";
import { RedisTokenBucketStorage } from "../storage/redis-token-bucket-storage";

export const storage = new RedisTokenBucketStorage(env.REDIS_URL);

export async function redisShutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    await storage.disconnect();
    console.log('Redis disconnected');
  } catch (err) {
    console.error('Error during disconnect:', err);
  }
}