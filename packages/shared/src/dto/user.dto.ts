import { UserRole, UserStatus } from '../enums';

export interface UserDto {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatarUrl?: string;
}
