import 'dotenv/config';
import express from "express";
import { rateLimiterMiddleware } from "./middleware";
import env from './utils/validate-env';
import { redisShutdown } from './utils/redis';

const app = express();

app.use(rateLimiterMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, rate-limited world!");
});

const server = app.listen(env.PORT, () => {
  console.log("Server running on http://localhost:3000");
});

async function shutdown(signal: string) {
  redisShutdown(signal); 
  server.close(() => {
    console.log('Express server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker/K8s stop
process.on('SIGQUIT', () => shutdown('SIGQUIT'));

