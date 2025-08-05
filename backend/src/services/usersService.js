const fs = require('fs').promises;
const path = require('path');

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
  const user = { name, email, phone, password };
  users.push(user);
  await saveUsers();
  return user;
}

function getUsers() {
  return users;
}

module.exports = { createUser, getUsers };
