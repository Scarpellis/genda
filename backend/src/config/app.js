const express = require('express');
const app = express();

app.use(express.json());

const usersRouter = require('../routes/usersRoutes');
app.use('/users', usersRouter);
const authRouter = require('../routes/authRoutes');
app.use(authRouter);
const appointmentsRouter = require('../routes/appointmentsRoutes');
app.use('/appointments', appointmentsRouter);

module.exports = app;
