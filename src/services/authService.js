const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const repo = require('../repositories/usuarioRepository');

const publico = ({ id, nome, email }) => ({ id, nome, email });

async function cadastrar({ name, email, password }) {
  const existe = (await repo.buscarPorEmail(email));
  if (existe) throw new AppError('E-mail já cadastrado.', 409);

  const senhaHash = await bcrypt.hash(password, 10);
  const usuario = await repo.criar({ nome: name, email, senhaHash });
  return publico(usuario);
}

async function autenticar({ email, password }) {
  const usuario = await repo.buscarPorEmail(email);
  const ok = usuario && (await bcrypt.compare(password, usuario.senha));
  if (!ok) throw new AppError('E-mail ou senha inválidos.', 401);
  // TODO: gerar JWT aqui
  return publico(usuario);
}

module.exports = { cadastrar, autenticar };