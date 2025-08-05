const jwt = require('jsonwebtoken');

const users = [];

function createUser(req, res) {
  const { name, email, phone, password } = req.body;
  const user = { name, email, phone, password };
  users.push(user);
  res.status(201).json(user);
}

function login(req, res) {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
}

module.exports = { createUser, login };
