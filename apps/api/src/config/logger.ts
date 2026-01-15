import { Params } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';

type HttpRequest = IncomingMessage & {
  headers: Record<string, string | string[] | undefined>;
};
type HttpResponse = ServerResponse & { statusCode: number };

export const loggerConfig: Params = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: false,
        colorize: true,
        levelFirst: true,
        translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        hideObject: true,
        ignore: 'pid,hostname,req,res,responseTime,requestId,severity',
      },
    },
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // Disable request/response serialization completely
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
    // Don't add extra custom properties
    customProps: () => ({}),
    // Customize log message
    customLogLevel: (req: HttpRequest, res: HttpResponse, error?: Error) => {
      if (res.statusCode >= 400 && !error) return 'warn';
      if (error) return 'error';
      if (res.statusCode >= 300) return 'silent';
      return 'info';
    },
    // Customize request logging
    customSuccessMessage: (req: HttpRequest, res: HttpResponse) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    // Customize error logging
    customErrorMessage: (req: HttpRequest, res: HttpResponse, error: Error) => {
      return `${req.method} ${req.url} ${res.statusCode} - ${error.message}`;
    },
  },
};
