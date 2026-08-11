import { IsString, MinLength } from 'class-validator';
import { CreateCommentDto as CreateCommentDtoType } from '@workspace/shared';

export class CreateCommentDto implements CreateCommentDtoType {
  @IsString()
  @MinLength(1)
  content!: string;
}
