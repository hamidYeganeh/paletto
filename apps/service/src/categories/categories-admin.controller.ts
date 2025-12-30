import { Body, Controller, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesService } from "./categories.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/categories")
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("create")
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Patch("update")
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(dto);
  }
}
