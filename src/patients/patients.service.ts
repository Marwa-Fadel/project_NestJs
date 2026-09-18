import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: number) {
    return this.prisma.patient.findUnique({ where: { userId } });
  }

  findById(id: number) {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  create(data: { name: string; userId: number }) {
    return this.prisma.patient.create({ data });
  }
}
