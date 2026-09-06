import { Injectable } from '@nestjs/common';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

// Simulated data (in-memory), same style as the rest of the project
@Injectable()
export class DoctorsService {
  private readonly doctors: Doctor[] = [
    { id: 1, name: 'Dr. Layla Haddad', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Omar Nasser', specialty: 'Dermatology' },
    { id: 3, name: 'Dr. Sara Khalil', specialty: 'Pediatrics' },
  ];

  exists(doctorId: number): boolean {
    return this.doctors.some((doctor) => doctor.id === doctorId);
  }

  findAll(): Doctor[] {
    return this.doctors;
  }
}
