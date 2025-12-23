import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MediumsController } from "./mediums.controller";
import { MediumsService } from "./mediums.service";
import { Medium, MediumSchema } from "./schemas/mediums.schema";
import { MediumsListService } from "./services/mediums-list.service";
import { MediumsCreateService } from "./services/mediums-create.service";
import { MediumsUpdateService } from "./services/mediums-update.service";
import { MediumsFindOneService } from "./services/mediums-find-one.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medium.name, schema: MediumSchema }]),
  ],
  controllers: [MediumsController],
  providers: [
    MediumsService,
    MediumsListService,
    MediumsCreateService,
    MediumsUpdateService,
    MediumsFindOneService,
  ],
})
export class MediumsModule {}
