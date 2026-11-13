const { gerarToken } = require('../utils/token');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const repo = require('../repositories/usuarioRepository');

const publico = ({ id, nome, email }) => ({ id, nome, email });

async function cadastrar({ name, email, password }) {
  const emailNormalizado = email.trim().toLowerCase();

  if (await repo.buscarPorEmail(emailNormalizado)) {
    throw new AppError('E-mail já cadastrado.', 409);
  }

  const senhaHash = await bcrypt.hash(password, 10);

  try {
    const usuario = await repo.criar({ nome: name.trim(), email: emailNormalizado, senhaHash });
    return publico(usuario);
  } catch (err) {
    // 2067 = violação de UNIQUE (duas requisições com o mesmo e-mail ao mesmo tempo)
    if (err.errcode === 2067) throw new AppError('E-mail já cadastrado.', 409);
    throw err;
  }
}

async function autenticar({ email, password }) {
  const usuario = await repo.buscarPorEmail(email);
  const ok = usuario && (await bcrypt.compare(password, usuario.senha));
  if (!ok) throw new AppError('E-mail ou senha inválidos.', 401);
  return publico(usuario);
}

async function login(credenciais) {
  const usuario = await autenticar(credenciais);
  return { usuario, token: gerarToken(usuario) };
}

async function obterPerfil(id) {
  const usuario = await repo.buscarPorId(id);
  if (!usuario) throw new AppError('Usuário não encontrado.', 404);
  return publico(usuario);
}

module.exports = { cadastrar, autenticar, login, obterPerfil };