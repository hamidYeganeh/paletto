import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./controllers/comments.controller";
import { CommentsAdminController } from "./controllers/comments-admin.controller";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { CreateCommentService } from "./services/create-comment.service";
import { ListCommentsService } from "./services/list-comments.service";
import { UpdateCommentStatusService } from "./services/update-comment-status.service";
import { Artwork, ArtworkSchema } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogSchema } from "src/blogs/schemas/blog.schema";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Artwork.name, schema: ArtworkSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [CommentsController, CommentsAdminController],
  providers: [
    CommentsService,
    CreateCommentService,
    ListCommentsService,
    UpdateCommentStatusService,
  ],
})
export class CommentsModule {}
