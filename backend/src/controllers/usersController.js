const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');

async function createUser(req, res) {
  const { name, email, phone, password } = req.body;
  try {
    const user = await usersService.createUser({ name, email, phone, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Could not save user' });
  }
}

function getUsers(req, res) {
  const users = usersService.getUsers();
  res.json(users);
}

function loginUser(req, res) {
  const { email, password } = req.body;
  const users = usersService.getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { createUser, getUsers, loginUser };
