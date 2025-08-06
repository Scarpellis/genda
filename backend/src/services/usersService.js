const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

let users = [];

async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to load users:', error);
    }
  }
}

async function saveUsers() {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Failed to save users:', error);
    throw error;
  }
}

async function createUser({ name, email, phone, password }) {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    const error = new Error('E-mail já cadastrado');
    error.status = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, phone, password: hashedPassword };
  users.push(user);
  await saveUsers();
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function getUsers() {
  return users.map(({ password, ...user }) => user);
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}
async function updateUser(email, { name, phone, password }) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (phone !== undefined) {
    user.phone = phone;
  }

  if (password !== undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  await saveUsers();
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function deleteUser(email) {
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  await saveUsers();
  return true;
}

module.exports = { createUser, getUsers, findUserByEmail, updateUser, deleteUser, loadUsers };
