import { PartialType } from '@nestjs/mapped-types';
import { UpdateCollectionDto as UpdateCollectionDtoType } from '@workspace/shared';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) implements UpdateCollectionDtoType {}
