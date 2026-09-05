import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

// 7. Pipes (validation)
export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
