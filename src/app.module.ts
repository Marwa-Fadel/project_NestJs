import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// 2. Modules
@Module({
  imports: [AppointmentsModule],
})
export class AppModule implements NestModule {
  // 8. Middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
