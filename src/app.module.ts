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
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import * as basicAuth from 'express-basic-auth';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRoot(bullmqConfig),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { admin: 'admin' },
      }),
    }),
    HealthModule,
    EmailModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
