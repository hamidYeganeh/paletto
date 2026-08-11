import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { Tag, TagSchema } from './schemas/tag.schema';
import { TaxonomyService } from './taxonomy.service';
import { TaxonomyController } from './taxonomy.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [TaxonomyController],
  providers: [TaxonomyService],
  exports: [TaxonomyService],
})
export class TaxonomyModule {}
