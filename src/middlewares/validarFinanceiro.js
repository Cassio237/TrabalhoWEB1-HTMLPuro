const AppError = require('../utils/AppError');
const CATEGORIAS = require('../utils/categorias');

const falhar = (next, errors) => next(new AppError('Dados inválidos.', 400, errors));
const dinheiroValido = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= 1_000_000_000;

function dataValida(texto) {
  if (typeof texto !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

function validarTransacao(req, res, next) {
  const { tipo, valor, categoria, descricao, data } = req.body;
  const errors = {};

  if (!['receita', 'despesa'].includes(tipo)) errors.tipo = 'Tipo deve ser receita ou despesa.';
  if (!dinheiroValido(valor)) errors.valor = 'Informe um valor maior que zero.';
  if (!CATEGORIAS.includes(categoria)) errors.categoria = 'Categoria inválida.';
  if (typeof descricao !== 'string' || !descricao.trim()) errors.descricao = 'Descrição é obrigatória.';
  else if (descricao.trim().length > 120) errors.descricao = 'Descrição deve ter no máximo 120 caracteres.';
  if (data !== undefined && !dataValida(data)) errors.data = 'Data inválida (use AAAA-MM-DD).';

  if (Object.keys(errors).length) return falhar(next, errors);
  next();
}

function validarOrcamento(req, res, next) {
  const { categoria, mes, ano, limite } = req.body;
  const errors = {};

  if (!CATEGORIAS.includes(categoria)) errors.categoria = 'Categoria inválida.';
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) errors.mes = 'Mês deve ser de 1 a 12.';
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) errors.ano = 'Ano inválido.';
  if (!dinheiroValido(limite)) errors.limite = 'Informe um limite maior que zero.';

  if (Object.keys(errors).length) return falhar(next, errors);
  next();
}

function validarId(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.id)) return next(new AppError('Identificador inválido.', 400));
  req.params.id = Number(req.params.id);
  next();
}

module.exports = { validarTransacao, validarOrcamento, validarId };
