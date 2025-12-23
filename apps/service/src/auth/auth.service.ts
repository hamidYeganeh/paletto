import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "src/users/schemas/users.schema";
import { UserRoles } from "src/users/enums/users-roles.enum";
import { UserStatus } from "src/users/enums/users-status.enum";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: AuthLoginDto): Promise<{ token: string }> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select("+password")
      .exec();

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("User is not active");
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = await this.jwtService.signAsync({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }

  async register(dto: AuthRegisterDto): Promise<{ token: string }> {
    try {
      const password = await bcrypt.hash(dto.password, 10);
      const user = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password,
        role: UserRoles.ARTIST,
      });

      const token = await this.jwtService.signAsync({
        sub: user._id,
        email: user.email,
        role: user.role,
      });

      return { token };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ConflictException("Email already in use");
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to register");
    }
  }
}
