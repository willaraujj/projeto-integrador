
const service = require('../services/consultorService');

// Cadastrar consultor
function cadastrar(req, res) {
    try {
        const consultor = service.cadastrar(req.body);

        return res.status(201).json({
            mensagem: 'Consultor cadastrado com sucesso!',
            consultor
        });

    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message
        });
    }
}

// Listar consultores
function listar(req, res) {
    const consultores = service.listar();

    return res.status(200).json(consultores);
}

module.exports = {
    cadastrar,
    listar
};
