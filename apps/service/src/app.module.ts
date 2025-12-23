import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { ArtworksModule } from "./artworks/artworks.module";
import { MediumsModule } from "./mediums/mediums.module";
import { StylesModule } from "./styles/styles.module";
import { OffersModule } from "./offers/offers.module";
import { CategoriesModule } from "./categories/categories.module";
import { MediaModule } from "./media/media.module";
import configs from "./config";
import envValidationSchema from "./config/env.validation";

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
    TechniquesModule,
    ArtworksModule,
    MediumsModule,
    StylesModule,
    OffersModule,
    CategoriesModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
