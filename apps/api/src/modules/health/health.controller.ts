import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  async check() {
    this.logger.log('Checking health');
    const result = await this.health.check([]);
    this.logger.log('Health check result', result);
    return result;
  }
}
