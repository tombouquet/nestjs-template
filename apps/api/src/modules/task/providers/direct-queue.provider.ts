import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QueueProvider } from '../interfaces/queue-provider.interface';
import { LoggingService } from '../../logging/logging.service';

/**
 * Direct queue provider - executes tasks immediately by making HTTP requests
 * Used in development mode
 */
@Injectable()
export class DirectQueueProvider implements QueueProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly loggingService: LoggingService,
  ) {}

  /**
   * Schedules a task by directly calling the endpoint
   * Adds a small delay to simulate async behavior
   */
  async scheduleTask(
    taskName: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    const baseUrl =
      process.env.SELF_URL || process.env.NODE_ENV === 'production'
        ? process.env.SELF_URL
        : 'http://localhost:4000';

    const url = `${baseUrl || ''}/task/${taskName}`;

    // Small delay to simulate async behavior
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await firstValueFrom(
        this.httpService.post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      this.loggingService.log(
        `Task executed directly - ${taskName} with data ${JSON.stringify(body)}`,
        { service: DirectQueueProvider.name },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.loggingService.error(
        `Failed to execute task ${url} with body ${JSON.stringify(body)} - ${errorMessage}`,
        error instanceof Error ? error : undefined,
        { service: DirectQueueProvider.name },
      );
      throw error;
    }
  }
}
