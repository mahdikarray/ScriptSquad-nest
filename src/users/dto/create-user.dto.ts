/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  province_state: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  rereferred_by: string;
  
  qrCodeDataUrl:string;
  twoFactorSecret: string;
  
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  image:string
  isVerify: boolean;

  hashdRt: string;

  createdAt: Date;
  updatedAt: Date;
}
