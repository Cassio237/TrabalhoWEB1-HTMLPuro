const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validarCadastro, validarLogin } = require('../middlewares/validarAuth');
const authController = require('../controllers/authController');
const autenticar = require('../middlewares/autenticar');

router.post('/signup', validarCadastro, asyncHandler(authController.signup));
router.post('/login', validarLogin, asyncHandler(authController.login));
router.get('/me', autenticar, asyncHandler(authController.me));

module.exports = router;