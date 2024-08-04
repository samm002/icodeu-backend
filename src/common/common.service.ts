import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';
import * as fs from 'fs';

@Injectable()
export class CommonService {
  constructor(private config: ConfigService, private s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File, folderName: string): Promise<{ url: string }> {
    const fileStream = fs.createReadStream(file.path);

    // Check if the stream is created properly
    if (!fileStream) {
      throw new Error('Failed to create file stream');
    }

    const contentType = file.mimetype || 'application/octet-stream';

    const upload = new Upload({
      client: this.s3Service,
      params: {
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Key: `images/${folderName}/${Date.now().toString()}-${file.originalname}`,
        Body: fileStream,
        ContentType: contentType,
      },
      tags: [], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    try {
      const data = await upload.done();
      const objectUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${data.Key}`;
      return { url: objectUrl };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    } finally {
      // Clean up local file
      fs.unlinkSync(file.path);
    }
  }
}
