import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { UserProfile } from "src/users/schemas/users-profile.schema";

@Injectable()
export class CreateBlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async execute(userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const author = await  this.
  }
}
