/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);

  // Create main admin
  const mainAdmin = await prisma.admin.create({
    data: {
      email: 'otwanemark254@gmail.com',
      password: hashedPassword,
      role: Role.MAIN_ADMIN,
      isMainAdmin: true,
    },
  });

  // Create regular admins
  const regularAdmins = await Promise.all(
    ['admin1@carrental.com', 'admin2@carrental.com'].map(async (email) => {
      const hashedPwd = await bcrypt.hash('admin123', saltRounds);
      return prisma.admin.create({
        data: {
          email,
          password: hashedPwd,
          role: Role.ADMIN,
          isMainAdmin: false,
        },
      });
    }),
  );

  console.log('Created main admin:', mainAdmin);
  console.log('Created regular admins:', regularAdmins);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
