const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../../users.json');
let users = [];

async function loadUsers() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Erro ao carregar usuários:', err);
    }
  }
}

async function saveUsers() {
  try {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Erro ao salvar usuários:', err);
    throw err;
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
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar usuário.' });
  }
}

module.exports = { createUser };
