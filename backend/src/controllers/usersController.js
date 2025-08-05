const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

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

async function createUser(req, res) {
  const { name, email, phone, password } = req.body;
  const user = { name, email, phone, password };
  users.push(user);
  try {
    await saveUsers();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Could not save user' });
  }
}

function getUsers(req, res) {
  res.json(users);
}

function loginUser(req, res) {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { createUser, getUsers, loginUser };

