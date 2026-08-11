import { ReportReason, ReportStatus } from '../enums';

export interface ReportDto {
  id: string;
  reporterId: string;
  targetType: 'artwork' | 'user' | 'comment' | 'review';
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface CreateReportDto {
  targetType: 'artwork' | 'user' | 'comment' | 'review';
  targetId: string;
  reason: ReportReason;
  description?: string;
}
