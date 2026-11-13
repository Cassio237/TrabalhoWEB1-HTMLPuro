const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middlewares/autenticar');
const { validarOrcamento, validarId } = require('../middlewares/validarFinanceiro');
const controller = require('../controllers/orcamentoController');

router.use(autenticar);

router.get('/', asyncHandler(controller.listar));
router.post('/', validarOrcamento, asyncHandler(controller.criar));
router.delete('/:id', validarId, asyncHandler(controller.excluir));

module.exports = router;
