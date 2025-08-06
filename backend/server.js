require('dotenv').config();
const express = require('express');
const path = require('path');
const app = require('./src/config/app');
const { loadUsers } = require('./src/services/usersService');

const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined.');
  process.exit(1);
}

async function startServer() {
  await loadUsers();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
