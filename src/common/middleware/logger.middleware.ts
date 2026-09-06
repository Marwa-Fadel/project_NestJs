import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// مفهوم ال Middleware
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[LOGGER] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
  }
}
