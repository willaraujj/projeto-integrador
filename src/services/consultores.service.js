const consultoresRepository = require('../repositories/consultores.repository');

class ErroHttp extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
  }
}

function validarDados(body) {
  const erros = [];
  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const especialidades = Array.isArray(body.especialidades)
    ? body.especialidades
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  if (!nome) erros.push('O campo "nome" é obrigatório e não pode ser vazio.');
  if (nome.length > 160) erros.push('O campo "nome" deve ter no máximo 160 caracteres.');
  if (especialidades.length === 0) erros.push('Informe pelo menos uma especialidade.');
  if (body.experiencia !== undefined && body.experiencia !== null && typeof body.experiencia !== 'string') {
    erros.push('O campo "experiencia" deve ser um texto.');
  }
  if (body.disponibilidade !== undefined && typeof body.disponibilidade !== 'boolean') {
    erros.push('O campo "disponibilidade" deve ser true ou false.');
  }
  if (body.contato !== undefined && body.contato !== null && typeof body.contato !== 'string') {
    erros.push('O campo "contato" deve ser um texto.');
  }

  if (erros.length > 0) throw new ErroHttp(400, 'Dados inválidos.', erros);

  return {
    nome,
    especialidades,
    experiencia: typeof body.experiencia === 'string' ? body.experiencia.trim() || null : null,
    disponibilidade: body.disponibilidade ?? true,
    contato: typeof body.contato === 'string' ? body.contato.trim() || null : null,
  };
}

async function listar() {
  return consultoresRepository.listar();
}

async function buscarPorId(id) {
  if (!/^\d+$/.test(id)) {
    throw new ErroHttp(400, 'O identificador deve ser um número inteiro positivo.');
  }
  const consultor = await consultoresRepository.buscarPorId(id);
  if (!consultor) throw new ErroHttp(404, 'Consultor não encontrado.');
  return consultor;
}

async function criar(body) {
  const dados = validarDados(body);
  return consultoresRepository.criar(dados);
}

module.exports = { listar, buscarPorId, criar };
