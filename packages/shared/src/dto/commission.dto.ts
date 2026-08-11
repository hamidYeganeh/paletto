import { CommissionStatus } from '../enums';

export interface CommissionDto {
  id: string;
  customerId: string;
  artistId: string;
  title: string;
  description: string;
  budget?: number;
  status: CommissionStatus;
  referenceImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionDto {
  artistId: string;
  title: string;
  description: string;
  budget?: number;
  referenceImages?: string[];
}

export interface UpdateCommissionStatusDto {
  status: CommissionStatus;
}
