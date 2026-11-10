const authService = require('../services/authService');

async function signup(req, res) {
  const usuario = await authService.cadastrar(req.body);
  res.status(201).json({ message: 'Usuário cadastrado com sucesso.', data: { usuario } });
}

async function login(req, res) {
  const usuario = await authService.autenticar(req.body);
  res.json({ message: 'Login realizado com sucesso.', data: { usuario } });
}

module.exports = { signup, login };