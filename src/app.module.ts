import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { HealthModule } from './modules/health/health.module';
import { loggerConfig } from './config/logger';

@Module({
  imports: [LoggerModule.forRoot(loggerConfig), HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
