import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exhibition, ExhibitionSchema } from './schemas/exhibition.schema';
import { ExhibitionsService } from './exhibitions.service';
import { ExhibitionsController } from './exhibitions.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exhibition.name, schema: ExhibitionSchema }])],
  controllers: [ExhibitionsController],
  providers: [ExhibitionsService],
  exports: [ExhibitionsService],
})
export class ExhibitionsModule {}
