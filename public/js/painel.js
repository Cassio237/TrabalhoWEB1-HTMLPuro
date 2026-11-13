import { MESES, corCss, criarGrafico, estiloEixos, formatarMoeda, formatarMoedaCompacta, itemTransacao, totaisPorMes } from './modules/utils.js';
import { listarTransacoes } from './modules/api.js';

let transacoes = [];
try {
  transacoes = await listarTransacoes();
} catch (err) {
  alert(err.message);
}
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth() + 1;

document.getElementById('dataAtual').textContent = hoje.toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

// ----- resumo: receita/despesas/economia do mês atual; saldo de todo o período -----
const doMes = transacoes.filter((t) => t.data.startsWith(`${ano}-${String(mes).padStart(2, '0')}`));
const soma = (lista, tipo) => lista.filter((t) => t.tipo === tipo).reduce((total, t) => total + t.valor, 0);

const campos = {
  valorReceita: soma(doMes, 'receita'),
  valorDespesas: soma(doMes, 'despesa'),
  valorEconomia: soma(doMes, 'receita') - soma(doMes, 'despesa'),
  valorSaldo: soma(transacoes, 'receita') - soma(transacoes, 'despesa'),
};

let ocultos = false;
const btnOcultar = document.getElementById('btnOcultarValores');
const icoValores = document.getElementById('icoValores');

function mostrarResumo() {
  for (const [id, valor] of Object.entries(campos)) {
    document.getElementById(id).textContent = ocultos ? 'R$ ••••' : formatarMoeda(valor);
  }
  icoValores.className = ocultos ? 'bi bi-eye-slash' : 'bi bi-eye';
  btnOcultar.setAttribute('aria-pressed', ocultos);
  btnOcultar.setAttribute('aria-label', ocultos ? 'Mostrar valores' : 'Ocultar valores');
}

btnOcultar.addEventListener('click', () => {
  ocultos = !ocultos;
  mostrarResumo();
});
mostrarResumo();

// troca a mensagem "sem dados" por um elemento (gráfico ou lista)
function ocuparPainel(idCorpo, idVazio, elemento) {
  document.getElementById(idVazio).hidden = true;
  document.getElementById(idCorpo).append(elemento);
}

// área onde o ECharts desenha (um div com altura definida no CSS)
const criarArea = () => Object.assign(document.createElement('div'), { className: 'grafico-area' });

//Receitas vs Despesas
const { receitas, despesas } = totaisPorMes(transacoes, ano);
const inicio = Math.max(0, mes - 6);
if ([...receitas, ...despesas].some((v) => v > 0)) {
  const area = criarArea();
  ocuparPainel('graficoReceitasDespesas', 'vazioReceitasDespesas', area);
  criarGrafico(area, {
    legend: { bottom: 0 },
    tooltip: { trigger: 'axis', valueFormatter: formatarMoeda },
    xAxis: { type: 'category', data: MESES.slice(inicio, mes), ...estiloEixos() },
    yAxis: { type: 'value', ...estiloEixos(formatarMoedaCompacta) },
    series: [
      { name: 'Receita', type: 'bar', data: receitas.slice(inicio, mes), itemStyle: { color: corCss('--sucesso') } },
      { name: 'Despesa', type: 'bar', data: despesas.slice(inicio, mes), itemStyle: { color: corCss('--erro') } },
    ],
  });
}

//Divisão por categoria
const CORES_DESPESA = {
  'Alimentação': '#ef4444', // vermelho
  'Moradia': '#f97316',     // laranja
  'Transporte': '#eab308',  // amarelo
  'Lazer': '#ec4899',       // rosa
  'Saúde': '#f70c00a8',       // vermelho
  'Educação': '#0719a1',    // azul
  'Outros': '#78716c',      // cinza quente
};
const COR_PADRAO = '#a8a29e';

const porCategoria = {};
doMes.filter((t) => t.tipo === 'despesa').forEach((t) => {
  porCategoria[t.categoria] = (porCategoria[t.categoria] ?? 0) + t.valor;
});
if (Object.keys(porCategoria).length > 0) {
  const area = criarArea();
  ocuparPainel('graficoCategorias', 'vazioCategorias', area);
  criarGrafico(area, {
    legend: { bottom: 0 },
    tooltip: { trigger: 'item', valueFormatter: formatarMoeda },
    series: [{
      type: 'pie',
      radius: ['50%', '72%'],
      label: { show: false },
      data: Object.entries(porCategoria)
        .sort(([, a], [, b]) => b - a) // maiores fatias primeiro
        .map(([name, value]) => ({
          name,
          value,
          itemStyle: { color: CORES_DESPESA[name] ?? COR_PADRAO },
        })),
    }],
  });
}

// Atividades recentes - 5 últimas
if (transacoes.length > 0) {
  const lista = document.createElement('ul');
  lista.className = 'lista';
  lista.innerHTML = [...transacoes].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 5)
    .map((t) => itemTransacao(t, false)).join('');
  ocuparPainel('listaAtividades', 'vazioAtividades', lista);
}

// Ajusta os gráficos quando a janela muda de tamanho
window.addEventListener('resize', function () {
    chartReceitas.resize();
    chartCategorias.resize();
});

