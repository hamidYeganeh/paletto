import { OtpPurpose, UserRole } from '../enums';

export interface RequestOtpDto {
  phone: string;
  purpose?: OtpPurpose;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
  purpose?: OtpPurpose;
  name?: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUserDto {
  id: string;
  phone: string;
  name?: string;
  role: UserRole;
}

export interface AuthResponseDto extends AuthTokensDto {
  user: AuthUserDto;
}
