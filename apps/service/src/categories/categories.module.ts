import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesAdminController } from "./categories-admin.controller";
import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./schemas/category.schema";
import { CreateCategoryService } from "./services/create-category.service";
import { UpdateCategoryService } from "./services/update-category.service";
import { GetCategoryService } from "./services/get-category.service";
import { ListCategoriesService } from "./services/list-categories.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [
    CategoriesService,
    CreateCategoryService,
    UpdateCategoryService,
    GetCategoryService,
    ListCategoriesService,
  ],
})
export class CategoriesModule {}
