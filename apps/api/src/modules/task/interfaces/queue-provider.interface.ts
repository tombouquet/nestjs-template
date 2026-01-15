/**
 * Interface for queue providers that can schedule tasks
 */
export interface QueueProvider {
  /**
   * Schedules a task to be executed
   * @param taskName The name of the task (used to determine the queue)
   * @param body The body/payload of the task
   * @returns Promise that resolves when the task is scheduled
   */
  scheduleTask(taskName: string, body: Record<string, unknown>): Promise<void>;
}

/**
 * Token for injecting QueueProvider
 */
export const QUEUE_PROVIDER_TOKEN = Symbol('QueueProvider');
