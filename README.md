This is sample project for rate limiting using token bucket algorithm with Redis storage.

# Rate Limiter with Token Bucket Algorithm
You can read about rate limiting and token bucket algorithm in the [documentation](https://www.samankefayatpour.com/blogs/rate-limiter).

# Setup
install dependencies:
```
pnpm install
```
Set up environment variables in a `.env` file:
```
REDIS_URL=your_redis_connection_string
PORT=3000
RATE_LIMIT_CAPACITY=5
RATE_LIMIT_REFILL_RATE=1       # tokens per second
# How long (seconds) to keep inactive buckets in Redis before they expire
BUCKET_TTL_SECONDS=86400
```
# Compose and run Redis using Docker:
```
docker-compose up -d
```
# Redis Insight for
Monitoring Redis values locally:
http://localhost:5540/

# Run the project:
```
pnpm dev
``` 

## Author
[Saman Kefayatpour](https://www.linkedin.com/in/samankefayatpour/)