const AppError = require('../utils/AppError');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCadastro(req, res, next) {
  const { name, email, username, password } = req.body;
  const errors = {};

  if (!name || !name.trim()) errors.name = 'Nome é obrigatório.';
  if (!email || !EMAIL.test(email)) errors.email = 'E-mail inválido.';
  if (!password || password.length < 6) errors.password = 'Senha deve ter ao menos 6 caracteres.';

  if (Object.keys(errors).length) return next(new AppError('Dados inválidos.', 400, errors));
  next();
}

function validarLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !EMAIL.test(email)) errors.email = 'E-mail inválido.';
  if (!password) errors.password = 'Senha é obrigatória.';

  if (Object.keys(errors).length) return next(new AppError('Dados inválidos.', 400, errors));
  next();
}

module.exports = { validarCadastro, validarLogin };