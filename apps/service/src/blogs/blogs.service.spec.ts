import { Test, TestingModule } from "@nestjs/testing";
import { BlogsService } from "./blogs.service";
import { CreateBlogService } from "./services/create-blog.service";
import { GetBlogService } from "./services/get-blog.service";
import { ListBlogsService } from "./services/list-blogs.service";
import { UpdateBlogService } from "./services/update-blog.service";
import { UpdateBlogStatusService } from "./services/update-blog-status.service";

describe("BlogsService", () => {
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        { provide: CreateBlogService, useValue: {} },
        { provide: GetBlogService, useValue: {} },
        { provide: ListBlogsService, useValue: {} },
        { provide: UpdateBlogService, useValue: {} },
        { provide: UpdateBlogStatusService, useValue: {} },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
