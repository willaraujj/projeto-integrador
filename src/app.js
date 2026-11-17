
const express = require('express');

const app = express();

const consultorRoutes = require('./routes/consultorRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Gestão de Consultores funcionando!');
});

app.use(consultorRoutes);


// Padroniza erros de JSON inválido e corpos acima do limite do Express.
app.use((erro, req, res, next) => {
    if (erro.type === 'entity.parse.failed') {
        return res.status(400).json({ mensagem: 'Envie um JSON válido.' });
    }
    if (erro.type === 'entity.too.large') {
        return res.status(413).json({ mensagem: 'O corpo da requisição excede o limite permitido.' });
    }
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

module.exports = app;
