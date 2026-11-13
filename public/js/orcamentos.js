import { CATEGORIAS, MESES, configurarModal, converterValor, esc, formatarMoeda, preencherSelect } from './modules/utils.js';
import { criarOrcamento, excluirOrcamento, listarOrcamentos } from './modules/api.js';

let orcamentos = [];
const hoje = new Date();

const lista = document.getElementById('listaOrcamentos');
const vazio = document.getElementById('vazioOrcamentos');
const modal = document.getElementById('modalOrcamento');
const form = document.getElementById('formOrcamento');
const selCategoria = document.getElementById('selCategoriaOrcamento');
const selMes = document.getElementById('selMesOrcamento');
const inpAno = document.getElementById('inpAnoOrcamento');
const inpLimite = document.getElementById('inpLimiteOrcamento');

preencherSelect(selCategoria, CATEGORIAS);

function estadoDe(pct) {
  if (pct > 100) return { classe: 'estado-estourado', selo: 'Limite excedido', icone: 'x-circle' };
  if (pct >= 80) return { classe: 'estado-alerta', selo: 'Perto do limite', icone: 'exclamation-circle' };
  return { classe: 'estado-ok', selo: 'Dentro do limite', icone: 'check-circle' };
}

function cardOrcamento(o) {
  const gasto = o.gasto; // já calculado pelo servidor
  const pct = (gasto / o.limite) * 100;
  const barra = Math.min(100, pct);
  const estado = estadoDe(pct);
  return `<article class="card orcamento ${estado.classe}" data-id="${esc(o.id)}">
    <div class="orcamento-topo">
      <span class="card-icone"><i class="bi bi-${estado.icone}" aria-hidden="true"></i></span>
      <div class="orcamento-info">
        <h2>${esc(o.categoria)} <span class="selo">${estado.selo}</span></h2>
        <p>${MESES[o.mes - 1]}/${o.ano} · Orçamento mensal</p>
      </div>
      <button type="button" class="btn-icone btn-sem-borda btn-excluir" aria-label="Excluir orçamento ${esc(o.categoria)}"><i class="bi bi-trash" aria-hidden="true"></i></button>
    </div>
    <div class="orcamento-valores"><p><strong>${formatarMoeda(gasto)}</strong> / ${formatarMoeda(o.limite)}</p><p>${Math.round(pct)}% usado</p></div>
    <div class="progresso" role="progressbar" aria-label="Uso do orçamento ${esc(o.categoria)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(barra)}"><div class="progresso-barra" style="--uso: ${barra}%"></div></div>
  </article>`;
}

function renderizar() {
  lista.innerHTML = orcamentos.map(cardOrcamento).join('');
  lista.hidden = orcamentos.length === 0;
  vazio.hidden = orcamentos.length > 0;
}

function valoresPadrao() {
  selMes.value = hoje.getMonth() + 1;
  inpAno.value = hoje.getFullYear();
}

lista.addEventListener('click', async (e) => {
  const botao = e.target.closest('.btn-excluir');
  if (!botao) return;
  if (!confirm('Excluir este orçamento?')) return;
  const id = botao.closest('.orcamento').dataset.id;
  try {
    await excluirOrcamento(id);
    orcamentos = orcamentos.filter((o) => String(o.id) !== id);
    renderizar();
  } catch (err) {
    alert(err.message);
  }
});

configurarModal(modal, document.getElementById('btnNovoOrcamento'), [
  document.getElementById('btnFecharModalOrcamento'),
  document.getElementById('btnCancelarOrcamento'),
]);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const limite = converterValor(inpLimite.value);
  if (!(limite > 0)) {
    inpLimite.setCustomValidity('Informe um limite maior que zero');
    inpLimite.reportValidity();
    inpLimite.setCustomValidity('');
    return;
  }
  try {
    const novo = await criarOrcamento({
      categoria: selCategoria.value,
      mes: Number(selMes.value),
      ano: Number(inpAno.value),
      limite,
    });
    orcamentos.push(novo);
    form.reset();
    valoresPadrao();
    modal.close();
    renderizar();
  } catch (err) {
    alert(err.message); // inclui o "Já existe um orçamento..." (409) vindo do servidor
  }
});

valoresPadrao();
try {
  orcamentos = await listarOrcamentos();
} catch (err) {
  alert(err.message);
}
renderizar();
