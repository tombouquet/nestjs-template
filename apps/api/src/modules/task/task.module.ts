import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TaskService } from './task.service';
import {
  QueueProvider,
  QUEUE_PROVIDER_TOKEN,
} from './interfaces/queue-provider.interface';
import { DirectQueueProvider } from './providers/direct-queue.provider';
import { QStashProvider } from './providers/qstash.provider';

/**
 * Task module for scheduling and executing tasks
 *
 * Uses the DirectQueueProvider by default, which executes tasks immediately via HTTP.
 * You can create custom queue providers by implementing the QueueProvider interface
 * and updating this module to use them.
 */
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    TaskService,
    DirectQueueProvider,
    QStashProvider,
    {
      provide: QUEUE_PROVIDER_TOKEN,
      useFactory: (
        directProvider: DirectQueueProvider,
        qstashProvider: QStashProvider,
      ): QueueProvider => {
        // You can change the provider here by:
        // 1. Direct swap: return a different provider instance
        // 2. Environment-based: use process.env.TASK_QUEUE_PROVIDER to select

        const providerType = process.env.TASK_QUEUE_PROVIDER || 'direct';

        switch (providerType) {
          case 'direct':
          default:
            return directProvider;
          case 'qstash':
            return qstashProvider;
          // Add more cases here when you create additional providers:
          // case 'bullmq':
          //   return bullmqProvider;
          // case 'rabbitmq':
          //   return rabbitmqProvider;
        }
      },
      inject: [DirectQueueProvider, QStashProvider],
    },
  ],
  exports: [TaskService],
})
export class TaskModule {}
