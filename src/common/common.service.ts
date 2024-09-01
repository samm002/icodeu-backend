import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';

import { S3Service } from '../s3/s3.service';

@Injectable()
export class CommonService {
  constructor(
    private config: ConfigService,
    private s3Service: S3Service,
  ) {}

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
        Key: `images/${folderName}/${file.filename}`,
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

  async uploadFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<{ urls: string[] }> {
    const urls = [];
    for (const file of files) {
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
          Key: `images/${folderName}/${file.filename}`,
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
        urls.push(objectUrl);
      } catch (error) {
        console.error({ error });
        throw new Error(`Failed to upload file: ${error.message}`);
      } finally {
        fs.unlinkSync(file.path);
      }
    }

    return { urls };
  }

  countDiscount(price: number, discount: number): number {
    const discountPrice = price * (discount / 100);

    return price - discountPrice;
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim() // Trim whitespace from both ends
      .replace(/\s+/g, '-') // Replace spaces with hyphens ('-')
      .replace(/-+$/g, ''); // Remove trailing hyphens
  }

  parseStringJSONToArray(jsonString: string): string[] {
    try {
      if (!jsonString || jsonString === '') {
        return [];
      }

      const parsed = JSON.parse(jsonString);

      if (Array.isArray(parsed)) {
        return parsed as string[];
      } else {
        return [jsonString];
      }
    } catch (error) {
      throw error;
    }
  }

  transformToNumber(...args: (string | number | undefined)[]): number[] {
    return args
      .map((arg) => (arg !== '' ? Number(arg) : null))
      .filter((num) => !isNaN(num));
  }
}
