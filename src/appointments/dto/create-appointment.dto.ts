import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

// Pipes
export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  // strict: true rejects calendar-impossible dates like 2026-02-30
  // (loose ISO8601 checking only validates the format, not real days-per-month)
  @IsDateString({ strict: true })
  startTime: string;

  @IsDateString({ strict: true })
  endTime: string;
}
