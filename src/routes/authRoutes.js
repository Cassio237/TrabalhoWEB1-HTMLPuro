const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validarCadastro, validarLogin } = require('../middlewares/validarAuth');
const authController = require('../controllers/authController');

router.post('/signup', validarCadastro, asyncHandler(authController.signup));
router.post('/login', validarLogin, asyncHandler(authController.login));

module.exports = router;