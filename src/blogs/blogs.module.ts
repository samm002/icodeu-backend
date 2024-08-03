import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({ dest: '../public/image' }),
  ],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
