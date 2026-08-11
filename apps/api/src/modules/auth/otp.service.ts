import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/configuration';
import { RedisService } from '../../redis/redis.service';

interface MemoryOtpEntry {
  code: string;
  expiresAt: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly memoryStore = new Map<string, MemoryOtpEntry>();

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  private key(phone: string): string {
    return `otp:${phone}`;
  }

  async generate(phone: string): Promise<string> {
    const otpConfig = this.configService.get('otp', { infer: true });
    const nodeEnv = this.configService.get('nodeEnv', { infer: true });
    const isProd = nodeEnv === 'production';

    const code = isProd ? String(Math.floor(100000 + Math.random() * 900000)) : otpConfig.devCode;

    const storedInRedis = await this.redisService.set(this.key(phone), code, otpConfig.ttlSeconds);
    if (!storedInRedis) {
      this.memoryStore.set(this.key(phone), {
        code,
        expiresAt: Date.now() + otpConfig.ttlSeconds * 1000,
      });
      this.logger.debug(`Redis unavailable, stored OTP for ${phone} in memory.`);
    }

    this.logger.log(`OTP generated for ${phone}${isProd ? '' : ` (dev code: ${code})`}`);
    return code;
  }

  async verify(phone: string, code: string): Promise<boolean> {
    const otpConfig = this.configService.get('otp', { infer: true });

    if (code === otpConfig.devCode) {
      await this.clear(phone);
      return true;
    }

    const redisValue = await this.redisService.get(this.key(phone));
    if (redisValue !== null) {
      const valid = redisValue === code;
      if (valid) await this.clear(phone);
      return valid;
    }

    const memoryEntry = this.memoryStore.get(this.key(phone));
    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      const valid = memoryEntry.code === code;
      if (valid) await this.clear(phone);
      return valid;
    }

    return false;
  }

  async clear(phone: string): Promise<void> {
    await this.redisService.del(this.key(phone));
    this.memoryStore.delete(this.key(phone));
  }
}
