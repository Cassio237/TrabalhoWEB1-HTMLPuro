//import { CATEGORIAS, MESES, configurarModal, converterValor, esc, formatarMoeda, idUnico, lerDados, preencherSelect, salvarDados } from './utils.js';

let orcamentos = lerDados('orcamentos');
const transacoes = lerDados('transacoes');
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

// quanto já foi gasto naquela categoria, mês e ano
function gastoDe(o) {
  const prefixo = `${o.ano}-${String(o.mes).padStart(2, '0')}`;
  return transacoes
    .filter((t) => t.tipo === 'despesa' && t.categoria === o.categoria && t.data.startsWith(prefixo))
    .reduce((total, t) => total + t.valor, 0);
}

function estadoDe(pct) {
  if (pct > 100) return { classe: 'estado-estourado', selo: 'Limite excedido', icone: 'x-circle' };
  if (pct >= 80) return { classe: 'estado-alerta', selo: 'Perto do limite', icone: 'exclamation-circle' };
  return { classe: 'estado-ok', selo: 'Dentro do limite', icone: 'check-circle' };
}

function cardOrcamento(o) {
  const gasto = gastoDe(o);
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

lista.addEventListener('click', (e) => {
  const botao = e.target.closest('.btn-excluir');
  if (!botao) return;
  if (!confirm('Excluir este orçamento?')) return;
  const id = botao.closest('.orcamento').dataset.id;
  orcamentos = orcamentos.filter((o) => o.id !== id);
  salvarDados('orcamentos', orcamentos);
  renderizar();
});

configurarModal(modal, document.getElementById('btnNovoOrcamento'), [
  document.getElementById('btnFecharModalOrcamento'),
  document.getElementById('btnCancelarOrcamento'),
]);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const limite = converterValor(inpLimite.value);
  if (!(limite > 0)) {
    inpLimite.setCustomValidity('Informe um limite maior que zero');
    inpLimite.reportValidity();
    inpLimite.setCustomValidity('');
    return;
  }
  const novo = { id: idUnico(), categoria: selCategoria.value, mes: Number(selMes.value), ano: Number(inpAno.value), limite };
  if (orcamentos.some((o) => o.categoria === novo.categoria && o.mes === novo.mes && o.ano === novo.ano)) {
    alert('Já existe um orçamento para essa categoria neste mês.');
    return;
  }
  orcamentos.push(novo);
  salvarDados('orcamentos', orcamentos);
  form.reset();
  valoresPadrao();
  modal.close();
  renderizar();
});

valoresPadrao();
renderizar();
