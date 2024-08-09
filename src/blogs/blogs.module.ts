import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [
    MulterModule.register({ dest: '../public/image' }), // for local store image
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
