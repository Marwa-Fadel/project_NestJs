import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const doctorCount = await prisma.doctor.count();
  if (doctorCount === 0) {
    await prisma.doctor.createMany({
      data: [
        { name: 'Dr. Layla Haddad', specialty: 'Cardiology' },
        { name: 'Dr. Omar Nasser', specialty: 'Dermatology' },
        { name: 'Dr. Sara Khalil', specialty: 'Pediatrics' },
      ],
    });
    console.log('Seeded 3 doctors.');
  } else {
    console.log('Doctors already seeded, skipping.');
  }

  // There's no API route to create an ADMIN (register always creates a
  // PATIENT, on purpose - letting anyone self-register as ADMIN would be a
  // security hole). So the only way to ever get an admin account is to seed
  // one directly here.
  const existingAdmin = await prisma.patient.findUnique({ where: { email: 'admin@test.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.patient.create({
      data: {
        name: 'Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Seeded 1 admin account (admin@test.com / admin123).');
  } else {
    console.log('Admin already seeded, skipping.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
