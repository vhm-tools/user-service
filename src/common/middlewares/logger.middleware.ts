import env from '@environments';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction): void {
    if (env.REQ_LOGGING) {
      res.on('finish', () => {
        const { method, originalUrl } = req;
        const { statusCode, statusMessage } = res;

        const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
        // `💬 ${req.httpVersion} ${req.method} ${req.originalUrl} ${
        //   req.headers['user-agent'] || req.headers
        // })`,

        if (statusCode >= 500) {
          return this.logger.error(message);
        }

        if (statusCode >= 400) {
          return this.logger.warn(message);
        }

        return this.logger.log(message);
      });
    }
    next();
  }
}
