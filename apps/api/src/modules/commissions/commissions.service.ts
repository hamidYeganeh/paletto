import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommissionDto } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Commission, CommissionDocument } from './schemas/commission.schema';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionStatusDto } from './dto/update-commission-status.dto';

@Injectable()
export class CommissionsService {
  constructor(@InjectModel(Commission.name) private readonly commissionModel: Model<CommissionDocument>) {}

  async create(customerId: string, dto: CreateCommissionDto): Promise<CommissionDocument> {
    const created = new this.commissionModel({
      customerId: new Types.ObjectId(customerId),
      artistId: new Types.ObjectId(dto.artistId),
      title: dto.title,
      description: dto.description,
      budget: dto.budget,
      referenceImages: dto.referenceImages ?? [],
    });
    return created.save();
  }

  async findByIdOrThrow(id: string): Promise<CommissionDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Commission not found');
    const commission = await this.commissionModel.findById(id).exec();
    if (!commission) throw new NotFoundException('Commission not found');
    return commission;
  }

  async findSent(customerId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { customerId: new Types.ObjectId(customerId) };
    const [items, total] = await Promise.all([
      this.commissionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.commissionModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async findReceived(artistId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { artistId: new Types.ObjectId(artistId) };
    const [items, total] = await Promise.all([
      this.commissionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.commissionModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async updateStatus(id: string, requesterId: string, isAdmin: boolean, dto: UpdateCommissionStatusDto) {
    const commission = await this.findByIdOrThrow(id);
    if (!isAdmin && commission.artistId.toString() !== requesterId) {
      throw new ForbiddenException('Only the receiving artist can update this commission');
    }
    commission.status = dto.status;
    await commission.save();
    return commission;
  }

  async count(): Promise<number> {
    return this.commissionModel.countDocuments().exec();
  }

  toDto(commission: CommissionDocument): CommissionDto {
    return {
      id: commission._id.toString(),
      customerId: commission.customerId.toString(),
      artistId: commission.artistId.toString(),
      title: commission.title,
      description: commission.description,
      budget: commission.budget,
      status: commission.status,
      referenceImages: commission.referenceImages,
      createdAt: (commission.createdAt ?? new Date()).toISOString(),
      updatedAt: (commission.updatedAt ?? new Date()).toISOString(),
    };
  }
}
