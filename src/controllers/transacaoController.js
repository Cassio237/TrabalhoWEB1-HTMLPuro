const service = require('../services/transacaoService');

async function listar(req, res) {
  const transacoes = await service.listar(req.usuario.id);
  res.json({ message: 'OK', data: { transacoes } });
}

async function criar(req, res) {
  const transacao = await service.criar(req.usuario.id, req.body);
  res.status(201).json({ message: 'Transação criada com sucesso.', data: { transacao } });
}

async function excluir(req, res) {
  await service.excluir(req.params.id, req.usuario.id);
  res.json({ message: 'Transação excluída com sucesso.' });
}

module.exports = { listar, criar, excluir };
