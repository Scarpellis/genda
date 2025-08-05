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

module.exports = { createUser, getUsers };
