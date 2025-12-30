import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { StylesController } from "./styles.controller";
import { StylesAdminController } from "./styles-admin.controller";
import { StylesService } from "./styles.service";
import { Style, StyleSchema } from "./schemas/style.schema";
import { CreateStyleService } from "./services/create-style.service";
import { UpdateStyleService } from "./services/update-style.service";
import { GetStyleService } from "./services/get-style.service";
import { ListStylesService } from "./services/list-styles.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Style.name, schema: StyleSchema }]),
  ],
  controllers: [StylesController, StylesAdminController],
  providers: [
    StylesService,
    CreateStyleService,
    UpdateStyleService,
    GetStyleService,
    ListStylesService,
  ],
})
export class StylesModule {}
