import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, UserRole } from '@workspace/shared';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(phone: string): Promise<{ message: string; devCode?: string }> {
    const code = await this.otpService.generate(phone);
    const isDev = process.env.NODE_ENV !== 'production';
    return {
      message: 'OTP sent successfully',
      ...(isDev ? { devCode: code } : {}),
    };
  }

  async verifyOtp(phone: string, code: string, name?: string): Promise<AuthResponseDto> {
    const isValid = await this.otpService.verify(phone, code);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.createUser(phone, UserRole.CUSTOMER, name);
    }

    return this.buildAuthResponse(user);
  }

  async reissueToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.buildAuthResponse(user);
  }

  signAccessToken(user: UserDocument): string {
    return this.jwtService.sign({
      sub: user._id.toString(),
      phone: user.phone,
      role: user.role,
    });
  }

  private buildAuthResponse(user: UserDocument): AuthResponseDto {
    return {
      accessToken: this.signAccessToken(user),
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }
}
