import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';

import { S3Service } from '../s3/s3.service';
import path from 'path';
import { sanitizeString } from './utils/sanitizeString.utils';

@Injectable()
export class CommonService {
  constructor(
    private config: ConfigService,
    private s3Service: S3Service,
  ) {}

  countDiscount(price: number, discount: number): number {
    const discountPrice = price * (discount / 100);

    return price - discountPrice;
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ url: string }> {
    const fileStream = fs.createReadStream(file.path);

    if (!fileStream) {
      throw new Error('Failed to create file stream');
    }

    const contentType = file.mimetype || 'application/octet-stream';

    const upload = new Upload({
      client: this.s3Service,
      params: {
        ACL: 'public-read',
        Bucket: this.config.get('S3_BUCKET'),
        Key: `images/${folderName}/${Date.now().toString()}-${file.filename}`,
        Body: fileStream,
        ContentType: contentType,
      },
      tags: [],
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    try {
      const data = await upload.done();
      const objectUrl = `https://${this.config.get('S3_BUCKET')}.s3.${this.config.get('S3_REGION')}.amazonaws.com/${data.Key}`;
      return { url: objectUrl };
    } catch (error) {
      console.error({ error });
      throw new Error(`Failed to upload file: ${error.message}`);
    } finally {
      fs.unlinkSync(file.path);
    }
  }
}
