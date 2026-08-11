import { IsString } from 'class-validator';
import { CreateTagDto as CreateTagDtoType } from '@workspace/shared';

export class CreateTagDto implements CreateTagDtoType {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;
}
