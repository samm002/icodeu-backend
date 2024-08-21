import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { PriceDetailsController } from './price-details.controller';
import { PriceDetailsService } from './price-details.service';
import { ProductsModule } from '../products/products.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [NestjsFormDataModule, ProductsModule, ServicesModule],
  controllers: [PriceDetailsController],
  providers: [PriceDetailsService],
  exports: [PriceDetailsService],
})
export class PriceDetailsModule {}
