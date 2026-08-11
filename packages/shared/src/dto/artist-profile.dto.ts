export interface ArtistProfileDto {
  id: string;
  userId: string;
  displayName: string;
  slug: string;
  bio?: string;
  coverImageUrl?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertArtistProfileDto {
  displayName: string;
  bio?: string;
  coverImageUrl?: string;
  location?: string;
  socialLinks?: Record<string, string>;
}
