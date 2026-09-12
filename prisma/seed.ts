import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.doctor.count();
  if (count > 0) {
    console.log('Doctors already seeded, skipping.');
    return;
  }

  await prisma.doctor.createMany({
    data: [
      { name: 'Dr. Layla Haddad', specialty: 'Cardiology' },
      { name: 'Dr. Omar Nasser', specialty: 'Dermatology' },
      { name: 'Dr. Sara Khalil', specialty: 'Pediatrics' },
    ],
  });

  console.log('Seeded 3 doctors.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
