import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// مفهوم ال Modules
@Module({
  imports: [AppointmentsModule],
})
export class AppModule implements NestModule {
  //مفهوم ال Middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
