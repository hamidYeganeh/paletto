import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commission, CommissionSchema } from './schemas/commission.schema';
import { CommissionsService } from './commissions.service';
import { CommissionsController } from './commissions.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Commission.name, schema: CommissionSchema }])],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}
