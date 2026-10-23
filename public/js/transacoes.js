import { CATEGORIAS, configurarModal, converterValor, dataDeHoje, idUnico, itemTransacao, lerDados, preencherSelect, salvarDados } from './utils.js';

let transacoes = lerDados('transacoes');
let tipoAtual = 'despesa';

const lista = document.getElementById('listaTransacoes');
const vazio = document.getElementById('vazioTransacoes');
const busca = document.getElementById('inpBuscaTransacao');
const filtroTipo = document.getElementById('selFiltroTipo');
const filtroCategoria = document.getElementById('selFiltroCategoria');
const modal = document.getElementById('modalTransacao');
const form = document.getElementById('formTransacao');
const btnReceita = document.getElementById('btnTipoReceita');
const btnDespesa = document.getElementById('btnTipoDespesa');
const inpValor = document.getElementById('inpValorTransacao');
const selCategoria = document.getElementById('selCategoriaTransacao');
const inpDescricao = document.getElementById('inpDescricaoTransacao');

preencherSelect(filtroCategoria, CATEGORIAS);
preencherSelect(selCategoria, CATEGORIAS);

function renderizar() {
  const termo = busca.value.trim().toLowerCase();
  const filtradas = transacoes
    .filter((t) => t.descricao.toLowerCase().includes(termo)
      && (!filtroTipo.value || t.tipo === filtroTipo.value)
      && (!filtroCategoria.value || t.categoria === filtroCategoria.value))
    .sort((a, b) => b.data.localeCompare(a.data));

  lista.innerHTML = filtradas.map((t) => itemTransacao(t)).join('');
  lista.hidden = filtradas.length === 0;
  vazio.hidden = filtradas.length > 0;
}

function selecionarTipo(tipo) {
  tipoAtual = tipo;
  btnReceita.setAttribute('aria-pressed', tipo === 'receita');
  btnDespesa.setAttribute('aria-pressed', tipo === 'despesa');
}

// filtros
[busca, filtroTipo, filtroCategoria].forEach((campo) => campo.addEventListener('input', renderizar));

// excluir (um só listener para todos os botões da lista)
lista.addEventListener('click', (e) => {
  const botao = e.target.closest('.btn-excluir');
  if (!botao) return;
  if (!confirm('Excluir esta transação?')) return;
  const id = botao.closest('.item').dataset.id;
  transacoes = transacoes.filter((t) => t.id !== id);
  salvarDados('transacoes', transacoes);
  renderizar();
});

// janela de nova transação
configurarModal(modal, document.getElementById('btnNovaTransacao'), [
  document.getElementById('btnFecharModalTransacao'),
  document.getElementById('btnCancelarTransacao'),
]);
btnReceita.addEventListener('click', () => selecionarTipo('receita'));
btnDespesa.addEventListener('click', () => selecionarTipo('despesa'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = converterValor(inpValor.value);
  if (!(valor > 0)) {
    inpValor.setCustomValidity('Informe um valor maior que zero');
    inpValor.reportValidity();
    inpValor.setCustomValidity('');
    return;
  }
  transacoes.push({
    id: idUnico(),
    tipo: tipoAtual,
    valor,
    categoria: selCategoria.value,
    descricao: inpDescricao.value.trim(),
    data: dataDeHoje(),
  });
  salvarDados('transacoes', transacoes);
  form.reset();
  selecionarTipo('despesa');
  modal.close();
  renderizar();
});

renderizar();
