import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Pipes (validation)
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
