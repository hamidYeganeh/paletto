import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { TechniquesController } from "./controllers/techniques.controller";
import { TechniquesAdminController } from "./controllers/techniques-admin.controller";
import { TechniquesService } from "./techniques.service";
import { Technique, TechniqueSchema } from "./schemas/technique.schema";
import { CreateTechniqueService } from "./services/create-technique.service";
import { UpdateTechniqueService } from "./services/update-technique.service";
import { UpdateTechniqueStatusService } from "./services/update-technique-status.service";
import { GetTechniqueService } from "./services/get-technique.service";
import { ListTechniquesService } from "./services/list-techniques.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Technique.name, schema: TechniqueSchema },
    ]),
  ],
  controllers: [TechniquesController, TechniquesAdminController],
  providers: [
    TechniquesService,
    CreateTechniqueService,
    UpdateTechniqueService,
    UpdateTechniqueStatusService,
    GetTechniqueService,
    ListTechniquesService,
  ],
})
export class TechniquesModule {}
