import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Pipes (validation)
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
