import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  UserProfile,
  UserProfileDocument,
} from "../schemas/users-profile.schema";
import { Artwork, ArtworkDocument } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogDocument } from "src/blogs/schemas/blog.schema";
import { ArtworkStatus } from "src/artworks/enums/artwork-status.enum";
import { IBlogsStatus } from "src/blogs/enums/blogs-status.enum";
import {
  ARTIST_PROFILE_SELECT,
  mapArtworkListItem,
  PUBLIC_ARTWORKS_LIST_SELECT,
  TAXONOMY_LIST_SELECT,
} from "src/artworks/utils/artwork-list-mapper";
import { Artist } from "../schemas/artists-profile.schema";
import { Technique } from "src/techniques/schemas/technique.schema";
import { Style } from "src/styles/schemas/style.schema";
import { Category } from "src/categories/schemas/category.schema";
import type { ListArtworksResponseDto } from "src/artworks/dto/list-artworks.dto";
import type { ListBlogsResponseDto } from "src/blogs/dto/list-blogs.dto";

const BLOG_LIST_SELECT =
  "_id title description slug status cover tags isScheduled publishAt authorId createdAt updatedAt";

type ArtworkProfileField = "savedArtworks" | "likedArtworks";
type BlogProfileField = "savedBlogs" | "likedBlogs";

@Injectable()
export class ProfileInteractionsService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>,
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async saveArtwork(userId: string, artworkId: string) {
    const artworkObjectId = this.toObjectId(artworkId, "Invalid artwork id");
    await this.ensureArtworkVisible(artworkObjectId);
    return this.updateArtworkList(userId, "savedArtworks", artworkObjectId, true);
  }

  async unsaveArtwork(userId: string, artworkId: string) {
    const artworkObjectId = this.toObjectId(artworkId, "Invalid artwork id");
    return this.updateArtworkList(
      userId,
      "savedArtworks",
      artworkObjectId,
      false
    );
  }

  async likeArtwork(userId: string, artworkId: string) {
    const artworkObjectId = this.toObjectId(artworkId, "Invalid artwork id");
    await this.ensureArtworkVisible(artworkObjectId);
    return this.updateArtworkList(userId, "likedArtworks", artworkObjectId, true);
  }

  async unlikeArtwork(userId: string, artworkId: string) {
    const artworkObjectId = this.toObjectId(artworkId, "Invalid artwork id");
    return this.updateArtworkList(
      userId,
      "likedArtworks",
      artworkObjectId,
      false
    );
  }

  async saveBlog(userId: string, blogId: string) {
    const blogObjectId = this.toObjectId(blogId, "Invalid blog id");
    await this.ensureBlogVisible(blogObjectId);
    return this.updateBlogList(userId, "savedBlogs", blogObjectId, true);
  }

  async unsaveBlog(userId: string, blogId: string) {
    const blogObjectId = this.toObjectId(blogId, "Invalid blog id");
    return this.updateBlogList(userId, "savedBlogs", blogObjectId, false);
  }

  async likeBlog(userId: string, blogId: string) {
    const blogObjectId = this.toObjectId(blogId, "Invalid blog id");
    await this.ensureBlogVisible(blogObjectId);
    return this.updateBlogList(userId, "likedBlogs", blogObjectId, true);
  }

  async unlikeBlog(userId: string, blogId: string) {
    const blogObjectId = this.toObjectId(blogId, "Invalid blog id");
    return this.updateBlogList(userId, "likedBlogs", blogObjectId, false);
  }

  async listSavedArtworks(userId: string): Promise<ListArtworksResponseDto> {
    return this.listArtworksByProfileField(userId, "savedArtworks");
  }

  async listSavedBlogs(userId: string): Promise<ListBlogsResponseDto> {
    return this.listBlogsByProfileField(userId, "savedBlogs");
  }

  async listLikedArtworks(userId: string): Promise<ListArtworksResponseDto> {
    return this.listArtworksByProfileField(userId, "likedArtworks");
  }

  async listLikedBlogs(userId: string): Promise<ListBlogsResponseDto> {
    return this.listBlogsByProfileField(userId, "likedBlogs");
  }

  private async listArtworksByProfileField(
    userId: string,
    field: ArtworkProfileField
  ): Promise<ListArtworksResponseDto> {
    const profile = await this.userProfileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean()
      .exec();

    const ids = profile?.[field] ?? [];

    if (!ids.length) {
      return { count: 0, artworks: [] };
    }

    const filters = {
      _id: { $in: ids },
      status: ArtworkStatus.ACTIVE,
      ...this.buildScheduleFilter(),
    };

    const artworks = await this.artworkModel
      .find(filters)
      .select(PUBLIC_ARTWORKS_LIST_SELECT)
      .populate({
        path: "artistId",
        select: ARTIST_PROFILE_SELECT,
        model: Artist.name,
      })
      .populate({
        path: "techniques",
        select: TAXONOMY_LIST_SELECT,
        model: Technique.name,
      })
      .populate({
        path: "styles",
        select: TAXONOMY_LIST_SELECT,
        model: Style.name,
      })
      .populate({
        path: "categories",
        select: TAXONOMY_LIST_SELECT,
        model: Category.name,
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      count: artworks.length,
      artworks: artworks.map((artwork) => mapArtworkListItem(artwork)),
    };
  }

  private async listBlogsByProfileField(
    userId: string,
    field: BlogProfileField
  ): Promise<ListBlogsResponseDto> {
    const profile = await this.userProfileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean()
      .exec();

    const ids = profile?.[field] ?? [];

    if (!ids.length) {
      return { count: 0, blogs: [] };
    }

    const filters = {
      _id: { $in: ids },
      status: IBlogsStatus.ACTIVE,
      ...this.buildScheduleFilter(),
    };

    const blogs = await this.blogModel
      .find(filters)
      .select(BLOG_LIST_SELECT)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { count: blogs.length, blogs };
  }

  private async updateArtworkList(
    userId: string,
    field: ArtworkProfileField,
    artworkId: Types.ObjectId,
    add: boolean
  ) {
    const update = add
      ? { $addToSet: { [field]: artworkId } }
      : { $pull: { [field]: artworkId } };

    const profile = await this.userProfileModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      })
      .exec();

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    return profile;
  }

  private async updateBlogList(
    userId: string,
    field: BlogProfileField,
    blogId: Types.ObjectId,
    add: boolean
  ) {
    const update = add
      ? { $addToSet: { [field]: blogId } }
      : { $pull: { [field]: blogId } };

    const profile = await this.userProfileModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      })
      .exec();

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    return profile;
  }

  private async ensureArtworkVisible(artworkId: Types.ObjectId) {
    const exists = await this.artworkModel.exists({
      _id: artworkId,
      status: ArtworkStatus.ACTIVE,
      ...this.buildScheduleFilter(),
    });

    if (!exists) {
      throw new NotFoundException("Artwork not found");
    }
  }

  private async ensureBlogVisible(blogId: Types.ObjectId) {
    const exists = await this.blogModel.exists({
      _id: blogId,
      status: IBlogsStatus.ACTIVE,
      ...this.buildScheduleFilter(),
    });

    if (!exists) {
      throw new NotFoundException("Blog not found");
    }
  }

  private buildScheduleFilter() {
    return {
      $or: [
        { isScheduled: { $ne: true } },
        { publishAt: { $lte: new Date() } },
      ],
    };
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
