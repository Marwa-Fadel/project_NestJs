import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorsService } from '../doctors/doctors.service';

// مفهوم لب Providers
@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async create(doctorId: number, patientId: number, startTime: Date, endTime: Date) {
    const doctorExists = await this.doctorsService.exists(doctorId);
    if (!doctorExists) {
      throw new NotFoundException(`Doctor with id ${doctorId} was not found.`);
    }

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      throw new BadRequestException('startTime/endTime must be a valid date.');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('endTime must be strictly after startTime.');
    }

    if (startTime < new Date()) {
      throw new BadRequestException('You cannot book an appointment in the past.');
    }

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      throw new ConflictException('Doctor is already booked for this time slot.');
    }

    return this.prisma.appointment.create({
      data: { doctorId, patientId, startTime, endTime, status: 'BOOKED' },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany();
  }
}
