import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
