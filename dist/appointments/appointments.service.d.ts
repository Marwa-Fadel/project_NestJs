import { Appointment } from './entities/appointment.entity';
export declare class AppointmentsService {
    private appointments;
    private idCounter;
    create(doctorId: number, patientId: number, startTime: Date, endTime: Date): Appointment;
    findAll(): Appointment[];
}
