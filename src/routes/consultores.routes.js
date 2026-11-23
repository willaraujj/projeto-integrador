const express = require('express');
const consultoresController = require('../controllers/consultores.controller');

const router = express.Router();

router.get('/', consultoresController.listar);
router.get('/:id', consultoresController.buscarPorId);
router.post('/', consultoresController.criar);

module.exports = router;
