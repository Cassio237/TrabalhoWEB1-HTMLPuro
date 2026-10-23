// Funções compartilhadas entre as telas do dashboard.
// Os dados ficam no localStorage por enquanto: quando o api.js existir, só lerDados/salvarDados mudam.

export const CATEGORIAS = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Salário', 'Freelance', 'Outros'];
export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaCompacta = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' });

export const formatarMoeda = (valor) => moeda.format(valor);
export const formatarMoedaCompacta = (valor) => moedaCompacta.format(valor);
export const formatarData = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR');
export const dataDeHoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD no fuso local
export const idUnico = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// "1.000,50" ou "1000.50" -> 1000.5 (NaN se inválido)
export function converterValor(texto) {
  const limpo = texto.trim();
  const numero = parseFloat(limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo);
  return Number.isFinite(numero) ? numero : NaN;
}

// protege o texto digitado pelo usuário antes de usar em innerHTML
export const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function lerDados(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? [];
  } catch (e) {
    return [];
  }
}

export function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch (e) { }
}

export function preencherSelect(select, opcoes) {
  opcoes.forEach((opcao) => select.append(new Option(opcao, opcao)));
}

export function configurarModal(modal, botaoAbrir, botoesFechar) {
  botaoAbrir.addEventListener('click', () => modal.showModal());
  botoesFechar.forEach((botao) => botao.addEventListener('click', () => modal.close()));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close(); // clique no fundo escuro
  });
}

// HTML de uma transação (usado em Transações e no Painel)
export function itemTransacao(t, comExcluir = true) {
  const receita = t.tipo === 'receita';
  return `<li class="item" data-id="${esc(t.id)}">
    <span class="card-icone ${receita ? 'icone-receita' : 'icone-despesa'}"><i class="bi bi-arrow-${receita ? 'up' : 'down'}-circle" aria-hidden="true"></i></span>
    <div class="item-info"><strong>${esc(t.descricao)}</strong><small>${esc(t.categoria)} · ${formatarData(t.data)}</small></div>
    <span class="item-valor ${receita ? 'valor-receita' : 'valor-despesa'}">${receita ? '+' : '–'} ${formatarMoeda(t.valor)}</span>
    ${comExcluir ? `<button type="button" class="btn-icone btn-sem-borda btn-excluir" aria-label="Excluir transação ${esc(t.descricao)}"><i class="bi bi-trash" aria-hidden="true"></i></button>` : ''}
  </li>`;
}

// totais de receita e despesa de cada mês (12 posições) do ano informado
export function totaisPorMes(transacoes, ano) {
  const receitas = Array(12).fill(0);
  const despesas = Array(12).fill(0);
  transacoes.forEach((t) => {
    const [a, m] = t.data.split('-').map(Number);
    if (a === ano) (t.tipo === 'receita' ? receitas : despesas)[m - 1] += t.valor;
  });
  return { receitas, despesas };
}

// lê uma variável do CSS (ex.: '--sucesso') para usar nos gráficos
export const corCss = (nome) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim();

// cores dos eixos do ECharts (formatador opcional para os números do eixo)
export const estiloEixos = (formatador) => ({
  axisLabel: { color: corCss('--muted'), formatter: formatador },
  axisLine: { lineStyle: { color: corCss('--borda') } },
  splitLine: { lineStyle: { color: corCss('--borda'), type: 'dashed' } },
});

// cria um gráfico ECharts com as cores do tema e redimensionamento automático
export function criarGrafico(elemento, opcoes) {
  const grafico = echarts.init(elemento);
  grafico.setOption({
    backgroundColor: 'transparent',
    aria: { enabled: true },
    textStyle: { color: corCss('--muted'), fontFamily: getComputedStyle(document.body).fontFamily },
    grid: { left: 8, right: 16, top: 24, bottom: 40, containLabel: true },
    legend: { textStyle: { color: corCss('--muted') } },
    tooltip: { backgroundColor: corCss('--surface'), borderColor: corCss('--borda'), textStyle: { color: corCss('--texto') } },
  });
  grafico.setOption(opcoes); // mescla com a base acima
  new ResizeObserver(() => grafico.resize()).observe(elemento);
  return grafico;
}
