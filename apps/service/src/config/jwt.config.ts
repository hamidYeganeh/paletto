import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES || "7d",
  issuer: process.env.JWT_ISSUER ?? "nest-app",
  audience: process.env.JWT_AUDIENCE || "",
}));
