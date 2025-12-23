import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StylesController } from "./styles.controller";
import { StylesService } from "./styles.service";
import { Style, StyleSchema } from "./schemas/styles.schema";
import { StylesCreateService } from "./services/styles-create.service";
import { StylesFindOneService } from "./services/styles-find-one.service";
import { StylesListService } from "./services/styles-list.service";
import { StylesUpdateService } from "./services/styles-update.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Style.name, schema: StyleSchema }]),
  ],
  providers: [
    StylesService,
    StylesListService,
    StylesCreateService,
    StylesUpdateService,
    StylesFindOneService,
  ],
  controllers: [StylesController],
})
export class StylesModule {}
