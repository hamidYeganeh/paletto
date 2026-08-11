import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';
import { RedisService } from '../../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly redisService: RedisService,
  ) {}

  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongo: this.mongoConnection.readyState === 1 ? 'connected' : 'disconnected',
      redis: this.redisService.isAvailable() ? 'connected' : 'unavailable',
    };
  }
}
