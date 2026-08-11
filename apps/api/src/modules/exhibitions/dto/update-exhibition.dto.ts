import { PartialType } from '@nestjs/mapped-types';
import { UpdateExhibitionDto as UpdateExhibitionDtoType } from '@workspace/shared';
import { CreateExhibitionDto } from './create-exhibition.dto';

export class UpdateExhibitionDto extends PartialType(CreateExhibitionDto) implements UpdateExhibitionDtoType {}
