import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@upstash/qstash';
import { QueueProvider } from '../interfaces/queue-provider.interface';

/**
 * QStash queue provider - uses Upstash QStash to schedule tasks
 * Requires QSTASH_TOKEN environment variable
 */
@Injectable()
export class QStashProvider implements QueueProvider {
  private readonly logger = new Logger(QStashProvider.name);
  private readonly client: Client;

  constructor() {
    const token = process.env.QSTASH_TOKEN;
    if (!token) {
      throw new Error(
        'QSTASH_TOKEN environment variable is required for QStashProvider',
      );
    }

    this.client = new Client({
      token,
    });
  }

  /**
   * Schedules a task using QStash
   * Publishes the task to the configured endpoint
   */
  async scheduleTask(
    taskName: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    const baseUrl =
      process.env.SELF_URL || process.env.NODE_ENV === 'production'
        ? process.env.SELF_URL
        : 'http://localhost:4000';

    if (!baseUrl) {
      throw new Error(
        'SELF_URL environment variable is required for QStashProvider',
      );
    }

    const url = `${baseUrl}/task/${taskName}`;

    try {
      await this.client.publish({
        url,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(
        `Task scheduled via QStash - ${taskName} with data ${JSON.stringify(body)}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to schedule task ${url} with body ${JSON.stringify(body)} - ${errorMessage}`,
      );
      throw error;
    }
  }
}
