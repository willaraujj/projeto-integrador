const repository = require('../repositories/consultorRepository');

function rejeitar(mensagem) {
    const erro = new Error(mensagem);
    erro.status = 400;
    throw erro;
}

function textoValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
}

function cadastrar(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        rejeitar('Envie um objeto JSON com os dados do consultor.');
    }

    // Regra principal: todo consultor precisa ter uma especialidade.
    if (!textoValido(dados.especialidade)) {
        rejeitar('O consultor precisa possuir uma especialidade.');
    }
    if (!textoValido(dados.nome)) {
        rejeitar('Informe o nome do consultor.');
    }
    if (!Number.isInteger(dados.experiencia) || dados.experiencia < 0) {
        rejeitar('A experiência deve ser um número inteiro de anos maior ou igual a zero.');
    }
    if (typeof dados.disponibilidade !== 'boolean') {
        rejeitar('A disponibilidade deve ser true ou false.');
    }
    if (!textoValido(dados.contato)) {
        rejeitar('Informe um contato do consultor.');
    }

    return repository.adicionar({
        id: repository.listarTodos().length + 1,
        nome: dados.nome.trim(),
        especialidade: dados.especialidade.trim(),
        experiencia: dados.experiencia,
        disponibilidade: dados.disponibilidade,
        contato: dados.contato.trim()
    });
}

function listar() {
    return repository.listarTodos();
}

module.exports = { cadastrar, listar };
