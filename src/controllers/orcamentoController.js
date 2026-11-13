const service = require('../services/orcamentoService');

async function listar(req, res) {
  const orcamentos = await service.listar(req.usuario.id);
  res.json({ message: 'OK', data: { orcamentos } });
}

async function criar(req, res) {
  const orcamento = await service.criar(req.usuario.id, req.body);
  res.status(201).json({ message: 'Orçamento criado com sucesso.', data: { orcamento } });
}

async function excluir(req, res) {
  await service.excluir(req.params.id, req.usuario.id);
  res.json({ message: 'Orçamento excluído com sucesso.' });
}

module.exports = { listar, criar, excluir };
