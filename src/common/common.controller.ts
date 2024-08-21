import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { CommonService } from './common.service';
import { storage } from '../common/utils';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('upload', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.commonService.uploadFile(file, 'products');
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('uploads[]', 10, { storage }))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const result = await this.commonService.uploadFiles(files, 'blogs');
      return result;
    } catch (error) {
      console.error({ error });
      throw new Error(`Error uploading files: ${error.message}`);
    }
  }
}
