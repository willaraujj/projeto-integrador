
const express = require('express');

const app = express();

const consultorRoutes = require('./routes/consultorRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Gestão de Consultores funcionando!');
});

app.use(consultorRoutes);

module.exports = app;
