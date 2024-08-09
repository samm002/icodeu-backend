import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ServiceType } from '../../common/enums';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  type: ServiceType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsArray()
  @IsOptional()
  features: string[];
}
