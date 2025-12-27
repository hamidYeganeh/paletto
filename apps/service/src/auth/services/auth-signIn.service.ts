import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/users.schema";
import { SignInDto, SignInResponseDto } from "../dto/sign-in.dto";

@Injectable()
export class AuthSignInService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = dto;

    const existingUser = await this.userModel
      .findOne({ email })
      .select("+password")
      .exec();

    if (existingUser) {
      const storedPassword = existingUser.password;
      const looksHashed =
        typeof storedPassword === "string" && storedPassword.startsWith("$2");

      let isPasswordValid = false;

      if (looksHashed) {
        isPasswordValid = await bcrypt.compare(password, storedPassword);
      } else {
        isPasswordValid = password === storedPassword;

        if (isPasswordValid) {
          const upgradedHash = await bcrypt.hash(password, 10);
          await this.userModel.updateOne(
            { _id: existingUser._id },
            { password: upgradedHash }
          );
        }
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const token = this.jwtService.sign({
        sub: existingUser._id.toString(),
      });

      return {
        token,
        signedUpBefore: true,
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const fallbackName = email?.split("@")?.[0] || "User";

    const newUser = await this.userModel.create({
      email,
      password: passwordHash,
      name: fallbackName,
    });

    const token = this.jwtService.sign({
      sub: newUser._id.toString(),
    });

    return {
      signedUpBefore: false,
      token,
    };
  }
}
