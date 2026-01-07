# Task Module

A flexible task scheduling module with a provider pattern for different queue implementations.

## Features

- **Provider Pattern**: Easily swap between different queue providers
- **Development Mode**: Direct execution via HTTP requests
- **Extensible**: Add your own queue providers by implementing the `QueueProvider` interface

## Usage

### Basic Usage

```typescript
import { TaskService } from './modules/task/task.service';

@Injectable()
export class MyService {
  constructor(private readonly taskService: TaskService) {}

  async doSomething() {
    // Schedule a task
    await this.taskService.scheduleTask('send-email', {
      to: 'user@example.com',
      subject: 'Hello',
      body: 'Welcome!',
    });
  }
}
```

### Configuration

Set the `SELF_URL` environment variable to configure the base URL for task endpoints:

Example `.env`:

```env
SELF_URL=http://localhost:4000  # Base URL for task endpoints
```

### Creating Task Handlers

Tasks are executed at `/task/:taskName`. Implement handlers in `TaskController`:

```typescript
// In task.controller.ts
@Post(':taskName')
async executeTask(
  @Param('taskName') taskName: string,
  @Body() body: Record<string, unknown>,
) {
  switch (taskName) {
    case 'send-email':
      return await this.emailService.sendEmail(body);
    case 'process-payment':
      return await this.paymentService.processPayment(body);
    default:
      throw new NotFoundException(`Task handler not found: ${taskName}`);
  }
}
```

### Creating Custom Queue Providers

Implement the `QueueProvider` interface:

```typescript
import { Injectable } from '@nestjs/common';
import { QueueProvider } from './interfaces/queue-provider.interface';

@Injectable()
export class MyCustomQueueProvider implements QueueProvider {
  async scheduleTask(
    taskName: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    // Your implementation here
  }
}
```

Then update `TaskModule` to use your provider:

```typescript
{
  provide: QueueProvider,
  useFactory: (): QueueProvider => {
    // Return your custom provider
    return new MyCustomQueueProvider();
  },
}
```

Or use environment-based selection:

```typescript
{
  provide: QueueProvider,
  useFactory: (
    directProvider: DirectQueueProvider,
    customProvider: MyCustomQueueProvider,
  ): QueueProvider => {
    const providerType = process.env.TASK_QUEUE_PROVIDER || 'direct';

    switch (providerType) {
      case 'my-custom':
        return customProvider;
      case 'direct':
      default:
        return directProvider;
    }
  },
  inject: [DirectQueueProvider, MyCustomQueueProvider],
}
```
