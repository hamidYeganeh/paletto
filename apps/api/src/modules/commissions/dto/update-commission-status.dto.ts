import { IsEnum } from 'class-validator';
import { CommissionStatus, UpdateCommissionStatusDto as UpdateCommissionStatusDtoType } from '@workspace/shared';

export class UpdateCommissionStatusDto implements UpdateCommissionStatusDtoType {
  @IsEnum(CommissionStatus)
  status!: CommissionStatus;
}
