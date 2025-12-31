import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { ListCategoriesQueryDto } from "../dto/list-categories.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { UpdateCategoryStatusDto } from "../dto/update-category-status.dto";
import { CategoriesService } from "../categories.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/categories")
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("create")
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Get("list")
  async listCategories(@Query() query: ListCategoriesQueryDto) {
    return this.categoriesService.listCategories(query);
  }

  @Patch("update")
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(dto);
  }

  @Patch("update-status")
  async updateCategoryStatus(@Body() dto: UpdateCategoryStatusDto) {
    return this.categoriesService.updateCategoryStatus(dto);
  }
}
