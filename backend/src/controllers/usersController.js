const usersService = require('../services/usersService');

async function createUser(req, res) {
  const { name, email, phone, password } = req.body;
  try {
    const user = await usersService.createUser({ name, email, phone, password });
    res.status(201).json(user);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Could not save user' });
    }
  }
}

async function getUsers(req, res) {
  try {
    const users = await usersService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve users' });
  }
}

async function updateUser(req, res) {
  const { email } = req.params;
  const { name, phone, password } = req.body;

  try {
    const updated = await usersService.updateUser(email, { name, phone, password });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Could not update user' });
  }
}

async function deleteUser(req, res) {
  const { email } = req.params;

  try {
    const deleted = await usersService.deleteUser(email);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete user' });
  }
}

module.exports = { createUser, getUsers, updateUser, deleteUser };
