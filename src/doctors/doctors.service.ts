import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async exists(doctorId: number): Promise<boolean> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    return doctor !== null;
  }

  findAll(specialty?: string) {
    return this.prisma.doctor.findMany({
      where: specialty ? { specialty } : undefined,
    });
  }

  create(data: { name: string; specialty: string }) {
    return this.prisma.doctor.create({ data });
  }
}
