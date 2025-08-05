const { createUser, listUsers } = require('../services/usersService');

function createUserController(req, res) {
  const user = createUser(req.body);
  res.status(201).json(user);
}

function listUsersController(req, res) {
  const users = listUsers();
  res.status(200).json(users);
}

module.exports = { createUser: createUserController, listUsers: listUsersController };
