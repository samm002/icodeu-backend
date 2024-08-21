import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
