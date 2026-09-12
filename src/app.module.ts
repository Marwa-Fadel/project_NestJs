import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';

// مفهوم ال Modules
@Module({
  imports: [PrismaModule, AppointmentsModule],
})
export class AppModule implements NestModule {
  //مفهوم ال Middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
