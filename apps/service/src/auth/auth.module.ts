import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RolesGuard } from "./guards/roles.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthSignInService } from "./services/auth-sign-in.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>("JWT_SECRET");
        const expiresIn = (config.get<string>("JWT_EXPIRES") ??
          "7d") as JwtSignOptions["expiresIn"];

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    AuthSignInService,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
