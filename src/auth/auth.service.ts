import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PatientsService } from '../patients/patients.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // normalize the email so "Marwa@Test.com" and "marwa@test.com" are
    // treated as the same account (SQLite string comparison is case-sensitive)
    const email = dto.email.trim().toLowerCase();

    const existing = await this.patientsService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const patient = await this.patientsService.create({
        name: dto.name,
        email,
        password: hashedPassword,
      });
      return this.signToken(patient.id, patient.role);
    } catch (e: any) {
      // race condition backstop: two registrations for the same email at
      // the exact same instant could both pass the check above - the DB's
      // own unique constraint catches it, we just turn that into a clean
      // 409 instead of leaking a raw 500.
      if (e?.code === 'P2002') {
        throw new ConflictException('Email is already registered.');
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const patient = await this.patientsService.findByEmail(email);
    if (!patient) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, patient.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.signToken(patient.id, patient.role);
  }

  private signToken(patientId: number, role: string) {
    const payload = { sub: patientId, role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getProfile(patientId: number) {
    const patient = await this.patientsService.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found.');
    }

    // never leak the hashed password to the client
    const { password, ...safePatient } = patient;
    return safePatient;
  }
}
