import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function seed() {
  const totalUser = await prisma.user.count({});
  if (totalUser > 1000) {
    return;
  }
  if (!(process.env.PASSWORD as string).length) {
    console.log("Seeding cancel. Please provide password");
  }
  for (let i = 0; i < 1000; i++) {
    const password = await bcrypt.hash(process.env.PASSWORD as string, 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        country: faker.location.country(),
        sex: faker.person.sex(),
      },
    });
  }
}
