import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { RequestContext } from './request-context';

type LogContext = Record<string, unknown>;

@Injectable()
export class LoggingService implements NestLoggerService {
  constructor(private readonly pinoLogger: PinoLogger) {}

  private getContextWithCorrelation(context?: LogContext): LogContext {
    const correlationId = RequestContext.getCorrelationId();
    const startTime = RequestContext.getStartTime();

    return {
      ...(correlationId && { correlationId }),
      ...(startTime && { requestDuration: Date.now() - startTime }),
      ...context,
    };
  }

  log(message: string, context?: LogContext): void;
  log(message: string, ...optionalParams: unknown[]): void;
  log(
    message: string,
    contextOrParam?: unknown,
    ...optionalParams: unknown[]
  ): void {
    const context =
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
        ? this.getContextWithCorrelation(contextOrParam as LogContext)
        : this.getContextWithCorrelation();

    if (
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
    ) {
      this.pinoLogger.info(context, message);
    } else if (contextOrParam !== undefined) {
      this.pinoLogger.info(
        this.getContextWithCorrelation(),
        message,
        contextOrParam,
        ...optionalParams,
      );
    } else {
      this.pinoLogger.info(context, message);
    }
  }

  error(message: string, trace?: string, context?: LogContext): void;
  error(message: string, ...optionalParams: unknown[]): void;
  error(
    message: string,
    traceOrParam?: unknown,
    contextOrParam?: unknown,
    ...optionalParams: unknown[]
  ): void {
    const baseContext = this.getContextWithCorrelation();

    if (
      typeof traceOrParam === 'string' &&
      typeof contextOrParam === 'object'
    ) {
      this.pinoLogger.error(
        {
          ...baseContext,
          ...(contextOrParam as LogContext),
          stack: traceOrParam,
        },
        message,
      );
    } else if (traceOrParam instanceof Error) {
      this.pinoLogger.error({ ...baseContext, err: traceOrParam }, message);
    } else if (typeof traceOrParam === 'object' && traceOrParam !== null) {
      this.pinoLogger.error(
        { ...baseContext, ...(traceOrParam as LogContext) },
        message,
      );
    } else if (traceOrParam !== undefined) {
      this.pinoLogger.error(
        baseContext,
        message,
        traceOrParam,
        contextOrParam,
        ...optionalParams,
      );
    } else {
      this.pinoLogger.error(baseContext, message);
    }
  }

  warn(message: string, context?: LogContext): void;
  warn(message: string, ...optionalParams: unknown[]): void;
  warn(
    message: string,
    contextOrParam?: unknown,
    ...optionalParams: unknown[]
  ): void {
    const context =
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
        ? this.getContextWithCorrelation(contextOrParam as LogContext)
        : this.getContextWithCorrelation();

    if (
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
    ) {
      this.pinoLogger.warn(context, message);
    } else if (contextOrParam !== undefined) {
      this.pinoLogger.warn(
        this.getContextWithCorrelation(),
        message,
        contextOrParam,
        ...optionalParams,
      );
    } else {
      this.pinoLogger.warn(context, message);
    }
  }

  debug(message: string, context?: LogContext): void;
  debug(message: string, ...optionalParams: unknown[]): void;
  debug(
    message: string,
    contextOrParam?: unknown,
    ...optionalParams: unknown[]
  ): void {
    const context =
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
        ? this.getContextWithCorrelation(contextOrParam as LogContext)
        : this.getContextWithCorrelation();

    if (
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
    ) {
      this.pinoLogger.debug(context, message);
    } else if (contextOrParam !== undefined) {
      this.pinoLogger.debug(
        this.getContextWithCorrelation(),
        message,
        contextOrParam,
        ...optionalParams,
      );
    } else {
      this.pinoLogger.debug(context, message);
    }
  }

  verbose(message: string, context?: LogContext): void;
  verbose(message: string, ...optionalParams: unknown[]): void;
  verbose(
    message: string,
    contextOrParam?: unknown,
    ...optionalParams: unknown[]
  ): void {
    const context =
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
        ? this.getContextWithCorrelation(contextOrParam as LogContext)
        : this.getContextWithCorrelation();

    if (
      typeof contextOrParam === 'object' &&
      contextOrParam !== null &&
      !Array.isArray(contextOrParam)
    ) {
      this.pinoLogger.trace(context, message);
    } else if (contextOrParam !== undefined) {
      this.pinoLogger.trace(
        this.getContextWithCorrelation(),
        message,
        contextOrParam,
        ...optionalParams,
      );
    } else {
      this.pinoLogger.trace(context, message);
    }
  }

  /**
   * Set the context for the logger (used by NestJS internally)
   */
  setContext(context: string): void {
    this.pinoLogger.setContext(context);
  }

  /**
   * Get the correlation ID for the current request
   */
  getCorrelationId(): string | undefined {
    return RequestContext.getCorrelationId();
  }
}
