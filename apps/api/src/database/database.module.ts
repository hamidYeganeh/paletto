import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { AppConfig } from '../config/configuration';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig, true>) => {
        const mongo = configService.get('mongo', { infer: true });

        if (mongo.useMemoryServer) {
          logger.log('MONGO_MEMORY=1 detected: preparing an in-memory MongoDB instance.');
          logger.log(
            'If MongoDB binaries are not already cached locally, mongodb-memory-server will download them now. This can take a while on first run.',
          );

          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const memoryServer = await MongoMemoryServer.create();
          const uri = memoryServer.getUri();

          logger.log(`In-memory MongoDB ready at ${uri}`);

          process.once('beforeExit', () => {
            void memoryServer.stop();
          });

          return { uri, dbName: 'paletto' };
        }

        logger.log(`Connecting to MongoDB at ${mongo.uri}`);
        return { uri: mongo.uri };
      },
    }),
  ],
})
export class DatabaseModule {}
