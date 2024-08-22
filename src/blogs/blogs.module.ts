import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
