import { Body, Controller, Post } from "@nestjs/common";
import { SignInDto, SignInResponseDto } from "../dto/sign-in.dto";
import { AuthService } from "../auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body() dto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(dto);
  }
}
