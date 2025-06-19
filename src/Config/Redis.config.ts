import Redis from 'ioredis';

export const redis = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
});
