const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middlewares/autenticar');
const { validarTransacao, validarId } = require('../middlewares/validarFinanceiro');
const controller = require('../controllers/transacaoController');

router.use(autenticar); // todas as rotas abaixo exigem login

router.get('/', asyncHandler(controller.listar));
router.post('/', validarTransacao, asyncHandler(controller.criar));
router.delete('/:id', validarId, asyncHandler(controller.excluir));

module.exports = router;
