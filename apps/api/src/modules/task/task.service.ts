import { Injectable, Inject } from '@nestjs/common';
import {
  QueueProvider,
  QUEUE_PROVIDER_TOKEN,
} from './interfaces/queue-provider.interface';
import { LoggingService } from '../logging/logging.service';

/**
 * Service for scheduling tasks
 * Uses the configured queue provider to schedule tasks
 */
@Injectable()
export class TaskService {
  constructor(
    @Inject(QUEUE_PROVIDER_TOKEN) private readonly queueProvider: QueueProvider,
    private readonly loggingService: LoggingService,
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
    this.loggingService.log(
      `Scheduling task: ${taskName} with data: ${JSON.stringify(body)}`,
      { service: TaskService.name },
    );
    await this.queueProvider.scheduleTask(taskName, body);
  }
}
