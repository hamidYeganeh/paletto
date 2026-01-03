import { Module } from "@nestjs/common";
import { BlogsController } from "./controllers/blogs.controller";
import { BlogsService } from "./blogs.service";
import { BlogsAdminController } from "./controllers/blogs-admin.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogsController, BlogsAdminController],
  providers: [BlogsService],
})
export class BlogsModule {}
