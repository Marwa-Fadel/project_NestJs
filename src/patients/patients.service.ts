import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.patient.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.patient.create({ data });
  }
}
