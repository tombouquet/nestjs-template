import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QueueProvider } from '../interfaces/queue-provider.interface';

/**
 * Direct queue provider - executes tasks immediately by making HTTP requests
 * Used in development mode
 */
@Injectable()
export class DirectQueueProvider implements QueueProvider {
  private readonly logger = new Logger(DirectQueueProvider.name);

  constructor(private readonly httpService: HttpService) {}

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

      this.logger.log(
        `Task executed directly - ${taskName} with data ${JSON.stringify(body)}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to execute task ${url} with body ${JSON.stringify(body)} - ${errorMessage}`,
      );
      throw error;
    }
  }
}
