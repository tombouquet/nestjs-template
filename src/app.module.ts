import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { HealthModule } from './modules/health/health.module';
import { EmailModule } from './modules/email/email.module';
import { loggerConfig } from './config/logger';
import { ConfigModule } from './modules/config/config.module';
import { typeOrmConfig } from './config/typeorm-nestjs';
import { BullModule } from '@nestjs/bullmq';
import { bullmqConfig } from './config/bullmq';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRoot(bullmqConfig),
    HealthModule,
    EmailModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
