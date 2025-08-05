const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

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

loadUsers();

async function createUser({ name, email, phone, password }) {
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
module.exports = { createUser, getUsers, findUserByEmail };
