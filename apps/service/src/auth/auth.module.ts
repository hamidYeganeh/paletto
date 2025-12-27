import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guards";
import { RolesGuard } from "./guards/role.guards";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
