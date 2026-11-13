const db = require('../config/database');

const COLUNAS = 'id, tipo, ROUND(valor_centavos / 100.0, 2) AS valor, categoria, descricao, data';

const stmtListar = db.prepare(
  `SELECT ${COLUNAS} FROM transacoes WHERE usuario_id = ? ORDER BY data DESC, id DESC`
);
const stmtInserir = db.prepare(
  `INSERT INTO transacoes (usuario_id, tipo, valor_centavos, categoria, descricao, data)
   VALUES (?, ?, ?, ?, ?, ?) RETURNING ${COLUNAS}`
);
const stmtRemover = db.prepare('DELETE FROM transacoes WHERE id = ? AND usuario_id = ?');

async function listarPorUsuario(usuarioId) {
  return stmtListar.all(usuarioId);
}

async function criar(usuarioId, { tipo, valorCentavos, categoria, descricao, data }) {
  return stmtInserir.get(usuarioId, tipo, valorCentavos, categoria, descricao, data);
}

// o "AND usuario_id" garante que ninguém apague a transação de outra pessoa
async function remover(id, usuarioId) {
  return stmtRemover.run(id, usuarioId).changes > 0;
}

module.exports = { listarPorUsuario, criar, remover };
