export type UserRole = "admin" | "user" | "artist";
export type UserStatus = "active" | "deactive" | "banned";

export type User = {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  _id?: string;
  userId: string;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UsersListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type UsersListResponse = {
  count: number;
  users: User[];
};

export type UserProfileResponse = {
  user: User;
  profile: UserProfile;
};

export type UpdateUserProfilePayload = {
  name?: string;
  bio?: string;
};
