const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5_000,
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS consultores (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nome VARCHAR(160) NOT NULL,
      especialidades TEXT[] NOT NULL,
      experiencia TEXT,
      disponibilidade BOOLEAN NOT NULL DEFAULT TRUE,
      contato VARCHAR(254),
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT consultores_nome_nao_vazio CHECK (length(trim(nome)) > 0),
      CONSTRAINT consultores_tem_especialidade CHECK (cardinality(especialidades) >= 1)
    );
  `);
}

module.exports = { pool, initializeDatabase };
