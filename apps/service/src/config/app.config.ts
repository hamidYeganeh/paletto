import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  env: process.env.NODE_ENV || "development",
  name: process.env.APP_NAME ?? "Paletto service",
  port: parseInt(process.env.PORT ?? "5000", 10),
}));
