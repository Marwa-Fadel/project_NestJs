import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

// Pipes
export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
