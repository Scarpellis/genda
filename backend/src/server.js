const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const usersRouter = require('./routes/usersRoutes');
app.use('/users', usersRouter);
const authRouter = require('./routes/authRoutes');
app.use(authRouter);

app.get('/', (req, res) => {
  res.send('API do Genda funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
