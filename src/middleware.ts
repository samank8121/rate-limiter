import { Request, Response, NextFunction } from "express";
import { RateLimiter } from "./rate-limiter";
import { storage } from "./utils/redis";
import env from './utils/validate-env';

const limiter = new RateLimiter(
  {
    capacity: env.RATE_LIMIT_CAPACITY,
    refillRate: env.RATE_LIMIT_REFILL_RATE, // tokens per second
  },
  storage,
);

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.ip || "anonymous"; // ← you can also use user id, API key, etc.

  const allowed = await limiter.allowRequest(key);

  if (!allowed) {
    return res.status(429).json({
      error: "Too Many Requests",
      retryAfter: 2,
    });
  }

  next();
};