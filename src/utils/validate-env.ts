import { cleanEnv, num, port, str } from 'envalid';

export default cleanEnv(process.env, {
  REDIS_URL: str(),
  PORT: port(),
  RATE_LIMIT_CAPACITY: num({ default: 100 }),
  RATE_LIMIT_REFILL_RATE: num({ default: 50 }),
  BUCKET_TTL_SECONDS: num({ default: 86400  }),
});
