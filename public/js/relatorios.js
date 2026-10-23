import { MESES, corCss, criarGrafico, estiloEixos, formatarMoeda, formatarMoedaCompacta, lerDados, totaisPorMes } from './utils.js';

const transacoes = lerDados('transacoes');
const ano = new Date().getFullYear();
const { receitas, despesas } = totaisPorMes(transacoes, ano);
const economia = receitas.map((r, i) => r - despesas[i]);
const rotulos = MESES.map((m) => `${m}/${String(ano).slice(2)}`);

const eixos = (extra = {}) => ({
  tooltip: { trigger: 'axis', valueFormatter: formatarMoeda },
  legend: { bottom: 0 },
  xAxis: { type: 'category', data: rotulos, ...estiloEixos(), ...extra },
  yAxis: { type: 'value', ...estiloEixos(formatarMoedaCompacta) },
});

const linha = (name, data, cor) => ({ name, type: 'line', smooth: true, data, itemStyle: { color: corCss(cor) } });
const barra = (name, data, cor) => ({ name, type: 'bar', data, itemStyle: { color: corCss(cor) } });

criarGrafico(document.getElementById('graficoFluxo'), {
  ...eixos({ boundaryGap: false }),
  series: [linha('Despesa', despesas, '--erro'), linha('Economia', economia, '--info'), linha('Receita', receitas, '--sucesso')],
});

criarGrafico(document.getElementById('graficoComparativo'), {
  ...eixos(),
  series: [barra('Receita', receitas, '--sucesso'), barra('Despesa', despesas, '--erro')],
});

// ----- exportar CSV -----
// texto entre aspas; o apóstrofo evita que o Excel execute fórmulas digitadas pelo usuário
const celula = (texto) => {
  let s = String(texto);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

document.getElementById('btnExportarCsv').addEventListener('click', () => {
  const linhas = [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'].map(celula).join(';')];
  [...transacoes].sort((a, b) => a.data.localeCompare(b.data)).forEach((t) => {
    linhas.push([t.data, t.tipo, t.categoria, t.descricao, t.valor.toFixed(2).replace('.', ',')].map(celula).join(';'));
  });
  const arquivo = new Blob(['\uFEFF' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = 'transacoes.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});
