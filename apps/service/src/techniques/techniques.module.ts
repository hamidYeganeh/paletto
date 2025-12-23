import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TechniquesController } from "./techniques.controller";
import { TechniquesService } from "./techniques.service";
import { Technique, TechniqueSchema } from "./schemas/techniques.schema";
import { TechniquesCreateService } from "./services/techniques-create.service";
import { TechniquesFindOneService } from "./services/techniques-find-one.service";
import { TechniquesListService } from "./services/techniques-list.service";
import { TechniquesUpdateService } from "./services/techniques-update.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Technique.name, schema: TechniqueSchema },
    ]),
  ],
  controllers: [TechniquesController],
  providers: [
    TechniquesService,
    TechniquesListService,
    TechniquesCreateService,
    TechniquesUpdateService,
    TechniquesFindOneService,
  ],
})
export class TechniquesModule {}
