import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Global module - PrismaService is injectable anywhere without re-importing this module
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
