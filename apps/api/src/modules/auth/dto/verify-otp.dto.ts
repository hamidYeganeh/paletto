import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { OtpPurpose, VerifyOtpDto as VerifyOtpDtoType } from '@workspace/shared';

export class VerifyOtpDto implements VerifyOtpDtoType {
  @Matches(/^09\d{9}$/, { message: 'phone must be a valid mobile number, e.g. 09120000000' })
  phone!: string;

  @IsString()
  @Length(4, 8)
  code!: string;

  @IsOptional()
  @IsEnum(OtpPurpose)
  purpose?: OtpPurpose;

  @IsOptional()
  @IsString()
  name?: string;
}
