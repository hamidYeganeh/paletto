export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
};

export type UsersListParams = {
  page?: number;
  perPage?: number;
};

export type UsersListResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
};

export type UserResponse = {
  data: User;
};
