import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  QueueProvider,
  QUEUE_PROVIDER_TOKEN,
} from './interfaces/queue-provider.interface';

/**
 * Service for scheduling tasks
 * Uses the configured queue provider to schedule tasks
 */
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(QUEUE_PROVIDER_TOKEN) private readonly queueProvider: QueueProvider,
  ) {}

  /**
   * Schedules a task to be executed
   * @param taskName The name of the task (used to determine the queue and endpoint)
   * @param body The body/payload of the task
   * @example
   * ```typescript
   * await taskService.scheduleTask('send-email', { to: 'user@example.com', subject: 'Hello' });
   * ```
   */
  async scheduleTask(
    taskName: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    this.logger.log(
      `Scheduling task: ${taskName} with data: ${JSON.stringify(body)}`,
    );
    await this.queueProvider.scheduleTask(taskName, body);
  }
}
