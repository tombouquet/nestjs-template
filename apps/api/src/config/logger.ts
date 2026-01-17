import { Params } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';

type HttpRequest = IncomingMessage & {
  headers: Record<string, string | string[] | undefined>;
  correlationId?: string;
};
type HttpResponse = ServerResponse & { statusCode: number };

const isProduction = process.env.NODE_ENV === 'production';

// Sensitive fields to redact from logs
const redactPaths = [
  'password',
  'newPassword',
  'confirmPassword',
  'hashedPassword',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'authorization',
  // Nested paths
  '*.password',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  '*.apiKey',
  '*.secret',
  '*.authorization',
  // Request headers
  'req.headers.authorization',
  'req.headers["x-api-key"]',
  // Deep nested
  '[*].password',
  '[*].token',
  '[*].secret',
];

export const loggerConfig: Params = {
  pinoHttp: {
    // Production uses JSON, development uses pretty printing
    ...(isProduction
      ? {}
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              singleLine: false,
              colorize: true,
              levelFirst: true,
              translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
              ignore: 'pid,hostname,context',
            },
          },
        }),

    // Redaction configuration
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]',
    },

    level: isProduction ? 'info' : 'debug',

    // Add correlation ID to every log
    customProps: (req: HttpRequest) => ({
      correlationId: req.correlationId,
    }),

    // Custom serializers
    serializers: {
      req: (req: HttpRequest) => ({
        method: req.method,
        url: req.url,
        correlationId: req.correlationId,
      }),
      res: (res: HttpResponse) => ({
        statusCode: res.statusCode,
      }),
    },

    // Customize log level based on response
    customLogLevel: (req: HttpRequest, res: HttpResponse, error?: Error) => {
      if (res.statusCode >= 500 || error) return 'error';
      if (res.statusCode >= 400) return 'warn';
      if (res.statusCode >= 300) return 'silent';
      return 'info';
    },

    // Customize request logging message
    customSuccessMessage: (req: HttpRequest, res: HttpResponse) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },

    // Customize error logging message
    customErrorMessage: (req: HttpRequest, res: HttpResponse, error: Error) => {
      return `${req.method} ${req.url} ${res.statusCode} - ${error.message}`;
    },

    // Generate request ID if not provided by middleware
    genReqId: (req: HttpRequest) => req.correlationId ?? randomUUID(),
  },
};
