import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserWithRole } from '../../common/interfaces';

// @Exclude()
export class ResponseUserDto {
  // @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  // @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @Expose()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;
  
  @IsString()
  @IsOptional()
  phoneNumber: string;
  
  @IsString()
  @IsOptional()
  profilePicture: string;
  
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(user: UserWithRole) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.address = user.address;
    this.phoneNumber = user.phoneNumber;
    this.profilePicture = user.profilePicture;
    this.role = user.role.name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
