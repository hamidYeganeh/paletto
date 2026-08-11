import { IsEnum, IsOptional, Matches } from 'class-validator';
import { OtpPurpose, RequestOtpDto as RequestOtpDtoType } from '@workspace/shared';

export class RequestOtpDto implements RequestOtpDtoType {
  @Matches(/^09\d{9}$/, { message: 'phone must be a valid mobile number, e.g. 09120000000' })
  phone!: string;

  @IsOptional()
  @IsEnum(OtpPurpose)
  purpose?: OtpPurpose;
}
