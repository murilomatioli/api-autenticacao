const express = require('express');
const app = express();
const routes = require('./routes/userRoutes');
var cron = require('node-cron')
app.use(express.json());
app.use('/', routes);

const server = app.listen(3001, () => {
    console.log('Server is running on port 3001');
});


server.on('error', (err) => {
    console.error('Erro ao iniciar o servidor:', err.message);
});
