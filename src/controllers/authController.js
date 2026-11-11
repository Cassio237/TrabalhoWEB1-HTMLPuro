const authService = require('../services/authService');

async function signup(req, res) {
  const usuario = await authService.cadastrar(req.body);
  res.status(201).json({ message: 'Usuário cadastrado com sucesso.', data: { usuario } });
}

async function login(req, res) {
  const { usuario, token } = await authService.login(req.body);
  res.json({ message: 'Login realizado com sucesso.', data: { usuario, token } });
}

async function me(req, res) {
  const usuario = await authService.obterPerfil(req.usuario.id);
  res.json({ message: 'OK', data: { usuario } });
}

module.exports = { signup, login, me };