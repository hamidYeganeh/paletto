import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/users.schema";
import { SignInDto, SignInResponseDto } from "../dto/sign-in.dto";
import { ErrorKeys } from "src/common/errors";

const BCRYPT_PREFIX = "$2";
const SALT_ROUNDS = 10;

@Injectable()
export class AuthSignInService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = dto;

    const existingUser = await this.findUserWithPassword(email);

    if (!existingUser) {
      const newUser = await this.createUser(email, password);
      return {
        token: this.signToken(newUser._id.toString()),
        signedUpBefore: false,
      };
    }

    const isPasswordValid = await this.validateAndUpgradePasswordIfNeeded(
      existingUser,
      password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorKeys.AUTH_INVALID_CREDENTIALS);
    }

    return {
      token: this.signToken(existingUser._id.toString()),
      signedUpBefore: true,
    };
  }

  private async findUserWithPassword(email: string) {
    return this.userModel.findOne({ email }).select("+password").exec();
  }

  private signToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  private async createUser(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return this.userModel.create({
      email,
      password: passwordHash,
    });
  }

  private isBcryptHash(value: unknown): value is string {
    return typeof value === "string" && value.startsWith(BCRYPT_PREFIX);
  }

  private async validateAndUpgradePasswordIfNeeded(
    user: User,
    inputPassword: string
  ): Promise<boolean> {
    const storedPassword = user.password;

    if (this.isBcryptHash(storedPassword)) {
      return bcrypt.compare(inputPassword, storedPassword);
    }

    const isMatch = inputPassword === storedPassword;
    if (!isMatch) return false;

    const upgradedHash = await bcrypt.hash(inputPassword, SALT_ROUNDS);
    await this.userModel
      .updateOne({ _id: user._id }, { password: upgradedHash })
      .exec();

    return true;
  }
}
