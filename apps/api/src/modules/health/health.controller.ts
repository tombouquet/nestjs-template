import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { LoggingService } from '../logging/logging.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private loggingService: LoggingService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    this.loggingService.log('Checking health', {
      service: HealthController.name,
    });
    const result = await this.health.check([]);
    this.loggingService.log('Health check result', {
      service: HealthController.name,
      result,
    });
    return result;
  }
}
