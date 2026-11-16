
const consultores = [];

// Listar todos os consultores
function listarTodos() {
    return consultores;
}

// Adicionar um novo consultor
function adicionar(consultor) {
    consultores.push(consultor);
    return consultor;
}

// Limpar a lista para os testes
function limpar() {
    consultores.length = 0;
}

module.exports = {
    listarTodos,
    adicionar,
    limpar
};
