
const repository = require('../repositories/consultorRepository');

// Cadastrar consultor
function cadastrar(dados) {

    const { especialidade } = dados;

    // Verificar se possui especialidade
    if (
        !especialidade ||
        typeof especialidade !== 'string' ||
        especialidade.trim() === ''
    ) {
        const erro = new Error(
            'O consultor precisa possuir uma especialidade.'
        );

        erro.status = 400;
        throw erro;
    }

    // Criar novo consultor
    const novoConsultor = {
        id: repository.listarTodos().length + 1,
        nome: dados.nome,
        especialidade: especialidade.trim(),
        experiencia: dados.experiencia,
        disponibilidade: dados.disponibilidade,
        contato: dados.contato
    };

    return repository.adicionar(novoConsultor);
}

// Consultar consultores
function listar() {
    return repository.listarTodos();
}

module.exports = {
    cadastrar,
    listar
};
