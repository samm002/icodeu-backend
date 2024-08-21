// import { Injectable, OnModuleDestroy } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as Redis from 'redis';

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   constructor(private readonly configService: ConfigService, private redisClient: Redis.RedisClientType) {
//     this.redisClient = Redis.createClient({
//       url: this.configService.get<string>('REDIS_URL'),
//       username: this.configService.get<string>('REDIS_USERNAME'),
//       password: this.configService.get<string>('REDIS_PASSWORD'),
//       // Add authentication if needed
//     });

//     this.redisClient.on('error', (err) => {
//       console.error('Redis error:', err);
//     });
//   }

//   getClient(): Redis.RedisClientType {
//     return this.redisClient;
//   }

//   async onModuleDestroy() {
//     await this.redisClient.quit();
//   }
// }
