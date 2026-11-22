const { pool } = require('../database');

const CAMPOS = 'id, nome, especialidades, experiencia, disponibilidade, contato, criado_em';

async function listar() {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM consultores ORDER BY id DESC`,
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM consultores WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

async function criar(consultor) {
  const { rows } = await pool.query(
    `INSERT INTO consultores (nome, especialidades, experiencia, disponibilidade, contato)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${CAMPOS}`,
    [
      consultor.nome,
      consultor.especialidades,
      consultor.experiencia,
      consultor.disponibilidade,
      consultor.contato,
    ],
  );
  return rows[0];
}

module.exports = { listar, buscarPorId, criar };
