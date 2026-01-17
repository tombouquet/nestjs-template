import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContext } from './request-context';

export const CORRELATION_ID_HEADER = 'x-correlation-id';
export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Extract correlation ID from headers or generate a new one
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) ||
      (req.headers[REQUEST_ID_HEADER] as string) ||
      randomUUID();

    // Set the correlation ID on the response header
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Store in request object for pino-http access
    (req as Request & { correlationId: string }).correlationId = correlationId;

    // Run the rest of the request within the AsyncLocalStorage context
    RequestContext.run(
      {
        correlationId,
        startTime: Date.now(),
      },
      () => {
        next();
      },
    );
  }
}
