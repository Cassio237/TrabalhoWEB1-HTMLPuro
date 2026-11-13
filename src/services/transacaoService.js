const AppError = require('../utils/AppError');
const repo = require('../repositories/transacaoRepository');

const hoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD

async function listar(usuarioId) {
  return repo.listarPorUsuario(usuarioId);
}

async function criar(usuarioId, { tipo, valor, categoria, descricao, data }) {
  return repo.criar(usuarioId, {
    tipo,
    valorCentavos: Math.round(valor * 100), // dinheiro guardado em centavos (inteiro)
    categoria,
    descricao: descricao.trim(),
    data: data || hoje(),
  });
}

async function excluir(id, usuarioId) {
  if (!(await repo.remover(id, usuarioId))) throw new AppError('Transação não encontrada.', 404);
}

module.exports = { listar, criar, excluir };
