const express = require('express');
const app = express();

app.use(express.json());

const usersRouter = require('../routes/usersRoutes');
app.use('/users', usersRouter);
const authRouter = require('../routes/authRoutes');
app.use(authRouter);

app.get('/', (req, res) => {
  res.send('API do Genda funcionando!');
});

module.exports = app;
