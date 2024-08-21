import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'Phone number must be a number' })
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
