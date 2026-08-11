export interface AppConfig {
  port: number;
  nodeEnv: string;
  mongo: {
    uri: string;
    useMemoryServer: boolean;
  };
  redis: {
    url: string;
  };
  jwt: {
    secret: string;
    accessExpiresIn: string;
  };
  otp: {
    devCode: string;
    ttlSeconds: number;
  };
  cors: {
    origins: string[];
  };
}

export default (): AppConfig => ({
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paletto',
    useMemoryServer: process.env.MONGO_MEMORY === '1',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'paletto-dev-secret',
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  otp: {
    devCode: process.env.OTP_DEV_CODE || '123456',
    ttlSeconds: Number(process.env.OTP_TTL_SECONDS) || 300,
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(','),
  },
});
