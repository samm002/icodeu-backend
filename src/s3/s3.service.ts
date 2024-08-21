import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service extends S3Client {
  constructor(config: ConfigService) {
    super({
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: config.get('S3_REGION'),
    });
  }

  async onModuleInit() {
    try {
      console.log('S3 client connected successfully.');
    } catch (error) {
      console.error('Failed to connect to S3:', error);
    }
  }

  async onModuleDestroy() {
    try {
      console.log('S3 client disconnected successfully.');
    } catch (error) {
      console.error('Failed to disconnect from S3:', error);
    }
  }
}
