const users = [];

function createUser(req, res) {
  const { name, email, phone, password } = req.body;
  const user = { name, email, phone, password };
  users.push(user);
  res.status(201).json(user);
}

module.exports = { createUser };
