import { PrismaClient } from '@prisma/client';
import { faker } from "@faker-js/faker";
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const copywriterRole = await prisma.role.upsert({
    where: { name: 'copywriter' },
    update: {},
    create: {
      name: 'copywriter',
    },
  });

  const productManagerRole = await prisma.role.upsert({
    where: { name: 'product-manager' },
    update: {},
    create: {
      name: 'product-manager',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
    },
  });

  // Seed users
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: await argon.hash('Admin123'),
      name: faker.person.fullName({ firstName: "admin" }),
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'copywriter@gmail.com' },
    update: {},
    create: {
      email: 'copywriter@gmail.com',
      password: await argon.hash('Copywriter123'),
      name: faker.person.fullName({ firstName: "copywriter" }),
      roleId: copywriterRole.id,
    },
  });
  
  await prisma.user.upsert({
    where: { email: 'productManager@gmail.com' },
    update: {},
    create: {
      email: 'productManager@gmail.com',
      password: await argon.hash('ProductManager123'),
      name: faker.person.fullName({ firstName: "ProductManager" }),
      roleId: productManagerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      password: await argon.hash('User123'),
      name: faker.person.fullName({ firstName: "user" }),
      roleId: userRole.id,
    },
  });
  
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
