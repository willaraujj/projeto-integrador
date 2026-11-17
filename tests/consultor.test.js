
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

const dadosValidos = {
    nome: 'Ana Souza',
    especialidade: 'Tecnologia',
    experiencia: 3,
    disponibilidade: true,
    contato: 'ana@example.com'
};

for (const especialidade of ['', '   ', 123, null]) {
    test(`rejeita especialidade inválida: ${JSON.stringify(especialidade)}`, async () => {
        const resposta = await request(app).post('/consultores')
            .send({ ...dadosValidos, especialidade });
        assert.equal(resposta.status, 400);
        assert.equal(repository.listarTodos().length, 0);
    });
}

for (const [campo, valor] of [
    ['nome', '  '], ['contato', ''], ['experiencia', -1],
    ['experiencia', 1.5], ['experiencia', '3'],
    ['disponibilidade', 'true'], ['disponibilidade', null]
]) {
    test(`rejeita ${campo} inválido: ${JSON.stringify(valor)}`, async () => {
        const resposta = await request(app).post('/consultores')
            .send({ ...dadosValidos, [campo]: valor });
        assert.equal(resposta.status, 400);
        assert.equal(repository.listarTodos().length, 0);
    });
}

test('consulta vazia retorna um array vazio', async () => {
    const resposta = await request(app).get('/consultores');
    assert.equal(resposta.status, 200);
    assert.deepEqual(resposta.body, []);
});

test('aceita indisponibilidade e experiência zero, normaliza textos e gera IDs', async () => {
    const primeiro = await request(app).post('/consultores').send({
        ...dadosValidos, nome: ' Ana Souza ', especialidade: ' Tecnologia ',
        contato: ' ana@example.com ', experiencia: 0, disponibilidade: false
    });
    const segundo = await request(app).post('/consultores').send(dadosValidos);
    assert.equal(primeiro.status, 201);
    assert.equal(segundo.status, 201);
    assert.deepEqual(primeiro.body.consultor, {
        ...dadosValidos, id: 1, experiencia: 0, disponibilidade: false
    });
    assert.equal(segundo.body.consultor.id, 2);
    const consulta = await request(app).get('/consultores');
    assert.deepEqual(consulta.body, [primeiro.body.consultor, segundo.body.consultor]);
});

test('rejeita cadastro sem corpo sem gerar erro interno', async () => {
    const resposta = await request(app).post('/consultores');
    assert.equal(resposta.status, 400);
    assert.equal(repository.listarTodos().length, 0);
});

test('rejeita array no lugar de um consultor', async () => {
    const resposta = await request(app).post('/consultores').send([]);
    assert.equal(resposta.status, 400);
    assert.equal(repository.listarTodos().length, 0);
});

test('JSON malformado retorna erro legível em JSON', async () => {
    const resposta = await request(app).post('/consultores')
        .set('Content-Type', 'application/json').send('{"nome":');
    assert.equal(resposta.status, 400);
    assert.equal(resposta.body.mensagem, 'Envie um JSON válido.');
});

test('rejeita corpo acima do limite sem cadastrar', async () => {
    const resposta = await request(app).post('/consultores')
        .send({ ...dadosValidos, nome: 'a'.repeat(110 * 1024) });
    assert.equal(resposta.status, 413);
    assert.equal(resposta.body.mensagem, 'O corpo da requisição excede o limite permitido.');
    assert.equal(repository.listarTodos().length, 0);
});
