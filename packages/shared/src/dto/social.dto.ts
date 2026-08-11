export interface FollowDto {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface LikeDto {
  id: string;
  userId: string;
  artworkId: string;
  createdAt: string;
}

export interface CommentDto {
  id: string;
  userId: string;
  artworkId: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
}
