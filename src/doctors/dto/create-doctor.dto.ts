import { IsNotEmpty, IsString } from 'class-validator';

// Pipes (validation)
export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;
}
