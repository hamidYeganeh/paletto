import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDto, UserRole } from '@workspace/shared';
import { User, UserDocument } from './schemas/user.schema';
import { parsePagination } from '../../common/utils/pagination.util';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findById(id).exec();
  }

  async createUser(phone: string, role: UserRole = UserRole.CUSTOMER, name?: string): Promise<UserDocument> {
    const user = new this.userModel({ phone, role, name });
    return user.save();
  }

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async promoteToArtist(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate({ _id: id, role: UserRole.CUSTOMER }, { role: UserRole.ARTIST }, { new: true })
      .exec();
  }

  async findAll(page?: number, limit?: number, role?: UserRole) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = role ? { role } : {};
    const [items, total] = await Promise.all([
      this.userModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((u) => this.toDto(u)), total, page: p, limit: l };
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  toDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: (user.createdAt ?? new Date()).toISOString(),
      updatedAt: (user.updatedAt ?? new Date()).toISOString(),
    };
  }
}
