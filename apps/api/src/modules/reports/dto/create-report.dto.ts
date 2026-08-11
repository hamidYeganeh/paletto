import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { CreateReportDto as CreateReportDtoType, ReportReason } from '@workspace/shared';
import { ReportTargetType } from '../schemas/report.schema';

export class CreateReportDto implements CreateReportDtoType {
  @IsIn(['artwork', 'user', 'comment', 'review'])
  targetType!: ReportTargetType;

  @IsString()
  targetId!: string;

  @IsEnum(ReportReason)
  reason!: ReportReason;

  @IsOptional()
  @IsString()
  description?: string;
}
