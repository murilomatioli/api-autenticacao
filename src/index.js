const express = require('express');
const app = express();
const routes = require('../src/routes/userRoutes');
const sequelize = require('./db/config/db');

app.use(express.json());
app.use('/', routes);

const startServer = async () => {
  try {

    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    const server = app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });

    server.on('error', (err) => {
      console.error('Erro ao iniciar o servidor:', err.message);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
};

startServer();
