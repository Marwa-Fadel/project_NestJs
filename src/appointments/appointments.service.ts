import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { DoctorsService } from '../doctors/doctors.service';

// 3. Providers
@Injectable()
export class AppointmentsService {
  private appointments: Appointment[] = [];
  private idCounter = 1;

  constructor(private readonly doctorsService: DoctorsService) {}

  create(doctorId: number, patientId: number, startTime: Date, endTime: Date): Appointment {
    // doctor must exist
    if (!this.doctorsService.exists(doctorId)) {
      throw new NotFoundException(`Doctor with id ${doctorId} was not found.`);
    }

    // reject inverted/zero-length ranges before storing anything -
    // this is what was letting an inverted appointment slip past the conflict check below
    if (startTime >= endTime) {
      throw new BadRequestException('endTime must be strictly after startTime.');
    }

    // reject appointments in the past
    if (startTime < new Date()) {
      throw new BadRequestException('You cannot book an appointment in the past.');
    }

    // Check for conflicts
    const hasConflict = this.appointments.some(
      (app) =>
        app.doctorId === doctorId &&
        startTime < app.endTime &&
        endTime > app.startTime,
    );

    if (hasConflict) {
      throw new ConflictException('Doctor is already booked for this time slot.');
    }

    const newAppointment: Appointment = {
      id: this.idCounter++,
      doctorId,
      patientId,
      startTime,
      endTime,
      status: 'BOOKED',
    };

    this.appointments.push(newAppointment);
    return newAppointment;
  }
  
  findAll() {
     return this.appointments;
  }
}
