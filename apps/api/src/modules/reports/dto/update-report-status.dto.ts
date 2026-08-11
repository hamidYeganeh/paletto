import { IsEnum } from 'class-validator';
import { ReportStatus } from '@workspace/shared';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  status!: ReportStatus;
}
