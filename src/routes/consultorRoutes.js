
const express = require('express');

const router = express.Router();

const controller = require('../controllers/consultorController');

// Cadastro
router.post('/consultores', controller.cadastrar);

// Consulta
router.get('/consultores', controller.listar);

module.exports = router;