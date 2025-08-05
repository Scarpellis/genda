require('dotenv').config();
const app = require('./src/config/app');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
