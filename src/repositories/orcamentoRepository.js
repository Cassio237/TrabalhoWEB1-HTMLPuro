const db = require('../config/database');

// "gasto" = soma das despesas da mesma categoria, mês e ano do orçamento (calculado no banco)
const COLUNAS = `
  o.id, o.categoria, o.mes, o.ano,
  ROUND(o.limite_centavos / 100.0, 2) AS limite,
  ROUND(COALESCE((
    SELECT SUM(t.valor_centavos) FROM transacoes t
    WHERE t.usuario_id = o.usuario_id
      AND t.tipo = 'despesa'
      AND t.categoria = o.categoria
      AND substr(t.data, 1, 7) = printf('%04d-%02d', o.ano, o.mes)
  ), 0) / 100.0, 2) AS gasto`;

const stmtListar = db.prepare(
  `SELECT ${COLUNAS} FROM orcamentos o WHERE o.usuario_id = ? ORDER BY o.ano DESC, o.mes DESC, o.categoria`
);
const stmtPorId = db.prepare(`SELECT ${COLUNAS} FROM orcamentos o WHERE o.id = ? AND o.usuario_id = ?`);
const stmtInserir = db.prepare(
  'INSERT INTO orcamentos (usuario_id, categoria, mes, ano, limite_centavos) VALUES (?, ?, ?, ?, ?)'
);
const stmtRemover = db.prepare('DELETE FROM orcamentos WHERE id = ? AND usuario_id = ?');

async function listarPorUsuario(usuarioId) {
  return stmtListar.all(usuarioId);
}

async function criar(usuarioId, { categoria, mes, ano, limiteCentavos }) {
  const { lastInsertRowid } = stmtInserir.run(usuarioId, categoria, mes, ano, limiteCentavos);
  return stmtPorId.get(lastInsertRowid, usuarioId);
}

async function remover(id, usuarioId) {
  return stmtRemover.run(id, usuarioId).changes > 0;
}

module.exports = { listarPorUsuario, criar, remover };
