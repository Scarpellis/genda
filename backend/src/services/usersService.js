const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
});

async function createUser({ name, email, phone, password }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('E-mail já cadastrado');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashedPassword },
  });
  const { password: _, id, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function getUsers() {
  const users = await prisma.user.findMany();
  return users.map(({ password, id, ...user }) => user);
}

function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function updateUser(email, { name, phone, password }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;
  if (password !== undefined) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    const updated = await prisma.user.update({
      where: { email },
      data,
    });
    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

async function deleteUser(email) {
  try {
    await prisma.user.delete({ where: { email } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
}

module.exports = { createUser, getUsers, findUserByEmail, updateUser, deleteUser };
