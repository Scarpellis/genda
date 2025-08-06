# Genda - Backend

API de agendamentos com intermediação de pagamentos e proteção a prestadores.

## Como rodar

1. Crie um arquivo `.env` na pasta `backend` com as variáveis:
   ```
   JWT_SECRET=<sua_chave_secreta>
   DATABASE_URL=<url_do_banco>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute as migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
