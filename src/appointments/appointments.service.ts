import { Injectable, ConflictException } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

// 3. Providers
@Injectable()
export class AppointmentsService {
  private appointments: Appointment[] = [];
  private idCounter = 1;

  create(doctorId: number, patientId: number, startTime: Date, endTime: Date): Appointment {
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
