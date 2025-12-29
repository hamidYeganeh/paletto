import { Injectable } from "@nestjs/common";
import { AuthSignInService } from "./services/auth-sign-in.service";
import { SignInDto, SignInResponseDto } from "./dto/sign-in.dto";

@Injectable()
export class AuthService {
  constructor(private readonly authSignInService: AuthSignInService) {}

  async signIn(dto: SignInDto): Promise<SignInResponseDto> {
    return this.authSignInService.execute(dto);
  }
}
