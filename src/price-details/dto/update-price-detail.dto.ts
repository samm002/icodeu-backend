import { PartialType } from '@nestjs/mapped-types';

import { CreatePriceDetailDto } from './create-price-detail.dto';

export class UpdatePriceDetailDto extends PartialType(CreatePriceDetailDto) {}
