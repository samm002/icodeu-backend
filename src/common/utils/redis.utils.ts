import { ConfigService } from '@nestjs/config';

import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const configService = new ConfigService();

const redisClient = createClient({
  url: configService.get<string>('REDIS_URL'),
  username: configService.get<string>('REDIS_USERNAME'),
  password: configService.get<string>('REDIS_PASSWORD'),
});

redisClient.on('connect', () => {
  console.log('Redis client connected successfully.');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err);
});

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'ris', // redis icodeu session
});

// Close Redis client
export async function closeRedisClient() {
  console.log('Attempting to close Redis client...');
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis client closed successfully.');
  }
}