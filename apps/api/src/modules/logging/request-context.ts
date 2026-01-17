import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  correlationId: string;
  startTime: number;
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestContextData>();

  static run<T>(data: RequestContextData, callback: () => T): T {
    return this.storage.run(data, callback);
  }

  static get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  static getCorrelationId(): string | undefined {
    return this.storage.getStore()?.correlationId;
  }

  static getStartTime(): number | undefined {
    return this.storage.getStore()?.startTime;
  }
}
