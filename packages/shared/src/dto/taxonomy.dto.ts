export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  parentId?: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
}
