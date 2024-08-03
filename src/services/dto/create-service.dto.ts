import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @IsOptional()
  description: string
  
  @IsNumber()
  @IsNotEmpty()
  price: number
  
  @IsNumber()
  @IsOptional()
  discount: number
  
  @IsArray()
  @IsOptional()
  features: string[]
}
