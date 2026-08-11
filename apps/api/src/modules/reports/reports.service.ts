import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReportDto } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>) {}

  async create(reporterId: string, dto: CreateReportDto): Promise<ReportDocument> {
    const created = new this.reportModel({
      reporterId: new Types.ObjectId(reporterId),
      targetType: dto.targetType,
      targetId: new Types.ObjectId(dto.targetId),
      reason: dto.reason,
      description: dto.description,
    });
    return created.save();
  }

  async findAll(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const [items, total] = await Promise.all([
      this.reportModel.find().sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.reportModel.countDocuments().exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async updateStatus(id: string, dto: UpdateReportStatusDto): Promise<ReportDocument> {
    const report = await this.reportModel.findByIdAndUpdate(id, { status: dto.status }, { new: true }).exec();
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this.reportModel.countDocuments(filter).exec();
  }

  toDto(report: ReportDocument): ReportDto {
    return {
      id: report._id.toString(),
      reporterId: report.reporterId.toString(),
      targetType: report.targetType,
      targetId: report.targetId.toString(),
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: (report.createdAt ?? new Date()).toISOString(),
    };
  }
}
