const express = require('express');
const cors = require('cors');
const { initializeDatabase, pool } = require('./database');
const consultoresRouter = require('./routes/consultores.routes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({ origin: frontendOrigins }));
app.use(express.json({ limit: '32kb' }));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', banco: 'conectado' });
  } catch {
    res.status(503).json({ status: 'indisponivel', banco: 'desconectado' });
  }
});

app.use('/api/consultores', consultoresRouter);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ erro: 'O corpo da requisição deve conter JSON válido.' });
  }
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    erro: status < 500 ? error.message : 'Erro interno do servidor.',
    ...(error.detalhes ? { detalhes: error.detalhes } : {}),
  });
});

async function start() {
  await initializeDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`API Gestão de Consultores disponível na porta ${port}.`);
  });
}

start().catch((error) => {
  console.error('Não foi possível iniciar a API:', error);
  process.exit(1);
});

