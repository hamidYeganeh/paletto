import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { AppConfig } from '../config/configuration';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private connected = false;

  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  async onModuleInit(): Promise<void> {
    const redisConfig = this.configService.get('redis', { infer: true });

    this.client = new Redis(redisConfig.url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      connectTimeout: 1500,
      enableOfflineQueue: false,
    });

    this.client.on('error', (err: Error) => {
      if (this.connected) {
        this.logger.warn(`Redis connection error: ${err.message}`);
      }
      this.connected = false;
    });

    try {
      await this.client.connect();
      this.connected = true;
      this.logger.log(`Connected to Redis at ${redisConfig.url}`);
    } catch (err) {
      this.connected = false;
      this.logger.warn(
        `Redis unavailable (${(err as Error).message}). Continuing without Redis using in-memory fallbacks.`,
      );
    }
  }

  onModuleDestroy(): void {
    this.client?.disconnect();
  }

  isAvailable(): boolean {
    return this.connected && !!this.client;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (err) {
      this.logger.warn(`Redis SET failed: ${(err as Error).message}`);
      this.connected = false;
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isAvailable() || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch (err) {
      this.logger.warn(`Redis GET failed: ${(err as Error).message}`);
      this.connected = false;
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable() || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(`Redis DEL failed: ${(err as Error).message}`);
      this.connected = false;
    }
  }
}
