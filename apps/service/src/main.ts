import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port", { infer: true }) ?? 5000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.enableCors();
  app.use("/medias", express.static(join(process.cwd(), "uploads")));

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()} 🚀`);
}

bootstrap();
