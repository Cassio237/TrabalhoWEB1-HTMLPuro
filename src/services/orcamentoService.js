const AppError = require('../utils/AppError');
const repo = require('../repositories/orcamentoRepository');

async function listar(usuarioId) {
  return repo.listarPorUsuario(usuarioId);
}

async function criar(usuarioId, { categoria, mes, ano, limite }) {
  try {
    return await repo.criar(usuarioId, { categoria, mes, ano, limiteCentavos: Math.round(limite * 100) });
  } catch (err) {
    if (err.errcode === 2067) throw new AppError('Já existe um orçamento para essa categoria neste mês.', 409);
    throw err;
  }
}

async function excluir(id, usuarioId) {
  if (!(await repo.remover(id, usuarioId))) throw new AppError('Orçamento não encontrado.', 404);
}

module.exports = { listar, criar, excluir };
