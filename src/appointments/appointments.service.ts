import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
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

    // ملفوفة بـ transaction: فحص التعارض والحجز لازم يصيروا كوحدة واحدة غير
    // قابلة للتجزئة، وإلا طلبين حجز لنفس الموعد بنفس اللحظة ممكن الاثنين
    // يفوتوا من فحص التعارض قبل ما أي منهم يخزّن.
    return this.prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (conflict) {
        throw new ConflictException('Doctor is already booked for this time slot.');
      }

      return tx.appointment.create({
        data: { doctorId, patientId, startTime, endTime, status: 'BOOKED' },
      });
    });
  }

  findAll(patientId?: number) {
    return this.prisma.appointment.findMany({
      where: patientId ? { patientId } : undefined,
    });
  }

  async findOne(id: number, requestingUserId?: number, requestingRole?: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} was not found.`);
    }

    if (
      requestingRole &&
      requestingRole !== 'ADMIN' &&
      appointment.patientId !== requestingUserId
    ) {
      throw new ForbiddenException('You can only view your own appointments.');
    }

    return appointment;
  }

  async cancel(id: number, requestingUserId: number, requestingRole: string) {
    const appointment = await this.findOne(id, requestingUserId, requestingRole);

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('This appointment is already cancelled.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
