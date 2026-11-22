const consultoresService = require('../services/consultores.service');

async function listar(_req, res, next) {
  try {
    const dados = await consultoresService.listar();
    res.json({ dados, total: dados.length });
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const consultor = await consultoresService.buscarPorId(req.params.id);
    res.json(consultor);
  } catch (error) {
    next(error);
  }
}

async function criar(req, res, next) {
  try {
    const consultor = await consultoresService.criar(req.body ?? {});
    res.status(201).json(consultor);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, buscarPorId, criar };
