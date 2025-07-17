import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGODB_URI') || 
          (process.env.NODE_ENV === 'development' 
            ? 'mongodb://host.docker.internal:27017/yourdb' 
            : 'mongodb://mongo:27017/yourdb');

        if (!uri) {
          logger.error('MONGODB_URI is not defined in environment');
          process.exit(1);
        }

        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoIndex: process.env.NODE_ENV !== 'production',
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 20,
          minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
          retryWrites: true,
          retryReads: true,
          connectTimeoutMS: 10000,
          heartbeatFrequencyMS: 30000,
          waitQueueTimeoutMS: 10000,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log(`Connected to MongoDB at ${uri.replace(/:.*@/, ':*****@')}`);
            });
            connection.on('error', (err) => {
              logger.error(`MongoDB connection error: ${err.message}`, err.stack);
            });
            connection.on('disconnected', () => {
              logger.warn('MongoDB disconnected - attempting to reconnect...');
            });
            connection.on('reconnected', () => {
              logger.log('MongoDB reconnected successfully');
            });
            connection.on('close', () => {
              logger.log('MongoDB connection closed');
            });
            return connection;
          },
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}