import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import configs from "./config";
import envValidationSchema from "./config/env.validation";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { ArtworksModule } from './artworks/artworks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: configs,
      cache: true,
      expandVariables: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>("database.uri"),
      }),
    }),
    UsersModule,
    AuthModule,
    ArtworksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
