// scripts/create-user-d1.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  const email = 'testuser' + Math.floor(Math.random() * 10000) + '@khybershawls.com';
  const passwordPlain = 'TestPass123!';
  const password = await bcrypt.hash(passwordPlain, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Test User',
      password,
      role: 'ADMIN',
    },
  });
  console.log('✅ User created:', { email, password: passwordPlain, role: 'ADMIN' });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
