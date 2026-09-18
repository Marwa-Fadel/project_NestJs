import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PatientsService } from '../patients/patients.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // normalize the email so "Marwa@Test.com" and "marwa@test.com" are
    // treated as the same account (SQLite string comparison is case-sensitive)
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.usersService.create({ email, password: hashedPassword });
      const patient = await this.patientsService.create({ name: dto.name, userId: user.id });
      return this.signToken(user.id, user.role, patient.id);
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
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // ADMIN accounts have no linked Patient profile - patientId stays undefined for them
    const patient = await this.patientsService.findByUserId(user.id);
    return this.signToken(user.id, user.role, patient?.id);
  }

  private signToken(userId: number, role: string, patientId?: number) {
    const payload = { sub: userId, role, patientId };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const patient = await this.patientsService.findByUserId(userId);
    // never leak the hashed password to the client
    const { password, ...safeUser } = user;
    return { ...safeUser, name: patient?.name };
  }
}
