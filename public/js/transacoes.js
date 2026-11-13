import { CATEGORIAS, configurarModal, converterValor, dataDeHoje, itemTransacao, preencherSelect } from './modules/utils.js';
import { criarTransacao, excluirTransacao, listarTransacoes } from './modules/api.js';

let transacoes = [];
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
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);

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
lista.addEventListener('click', async (e) => {
  const botao = e.target.closest('.btn-excluir');
  if (!botao) return;
  if (!confirm('Excluir esta transação?')) return;
  const id = botao.closest('.item').dataset.id;
  try {
    await excluirTransacao(id);
    transacoes = transacoes.filter((t) => String(t.id) !== id);
    renderizar();
  } catch (err) {
    alert(err.message);
  }
});

// janela de nova transação
configurarModal(modal, document.getElementById('btnNovaTransacao'), [
  document.getElementById('btnFecharModalTransacao'),
  document.getElementById('btnCancelarTransacao'),
]);
btnReceita.addEventListener('click', () => selecionarTipo('receita'));
btnDespesa.addEventListener('click', () => selecionarTipo('despesa'));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const valor = converterValor(inpValor.value);
  if (!(valor > 0)) {
    inpValor.setCustomValidity('Informe um valor maior que zero');
    inpValor.reportValidity();
    inpValor.setCustomValidity('');
    return;
  }
  try {
    const nova = await criarTransacao({
      tipo: tipoAtual,
      valor,
      categoria: selCategoria.value,
      descricao: inpDescricao.value.trim(),
      data: dataDeHoje(),
    });
    transacoes.push(nova);
    form.reset();
    selecionarTipo('despesa');
    modal.close();
    renderizar();
  } catch (err) {
    alert(err.message);
  }
});

// carga inicial: busca as transações do usuário no servidor
try {
  transacoes = await listarTransacoes();
} catch (err) {
  alert(err.message);
}
renderizar();
