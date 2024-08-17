import { Module } from '@nestjs/common';

import { PriceDetailsController } from './price-details.controller';
import { PriceDetailsService } from './price-details.service';

@Module({
  controllers: [PriceDetailsController],
  providers: [PriceDetailsService],
  exports: [PriceDetailsService],
})
export class PriceDetailsModule {}
