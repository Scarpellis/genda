const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const usersRouter = require('./routes/usersRoutes');
const { login } = require('./controllers/usersController');
app.use('/users', usersRouter);
app.post('/login', login);

app.get('/', (req, res) => {
  res.send('API do Genda funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
