
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const repository = require('../src/repositories/consultorRepository');

// Limpar a lista antes de cada teste
beforeEach(() => {
    repository.limpar();
});

// TESTE 1: Cadastro válido
test('deve cadastrar um consultor corretamente', async () => {

    const resposta = await request(app)
        .post('/consultores')
        .send({
            nome: 'Ana Souza',
            especialidade: 'Tecnologia',
            experiencia: 3,
            disponibilidade: true,
            contato: 'ana@email.com'
        });

    assert.equal(resposta.status, 201);

    assert.equal(
        resposta.body.consultor.nome,
        'Ana Souza'
    );
});

// TESTE 2: Cadastro inválido
test('deve rejeitar consultor sem especialidade', async () => {

    const resposta = await request(app)
        .post('/consultores')
        .send({
            nome: 'Carlos Silva',
            experiencia: 2,
            disponibilidade: true,
            contato: 'carlos@email.com'
        });

    assert.equal(resposta.status, 400);

    assert.equal(
        resposta.body.mensagem,
        'O consultor precisa possuir uma especialidade.'
    );

    assert.equal(repository.listarTodos().length, 0);
});

// TESTE 3: Consulta de consultores
test('deve listar os consultores cadastrados', async () => {

    // Cadastrar um consultor para realizar a consulta
    await request(app)
        .post('/consultores')
        .send({
            nome: 'Pedro Santos',
            especialidade: 'Administração',
            experiencia: 4,
            disponibilidade: true,
            contato: 'pedro@email.com'
        });

    const resposta = await request(app)
        .get('/consultores');

    assert.equal(resposta.status, 200);

    assert.equal(resposta.body.length, 1);

    assert.equal(
        resposta.body[0].nome,
        'Pedro Santos'
    );
});
