process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'file:memdb1?mode=memory&cache=shared';

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "phone" TEXT NOT NULL,
      "password" TEXT NOT NULL
    );
  `;
});

afterEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  const dbPath = path.join(__dirname, '..', 'prisma', 'memdb1');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});

module.exports = prisma;
