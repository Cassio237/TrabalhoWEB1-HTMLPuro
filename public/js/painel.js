import { MESES, corCss, criarGrafico, estiloEixos, formatarMoeda, formatarMoedaCompacta, itemTransacao, lerDados, totaisPorMes } from './utils.js';

const transacoes = lerDados('transacoes');
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
const porCategoria = {};
doMes.filter((t) => t.tipo === 'despesa').forEach((t) => {
  porCategoria[t.categoria] = (porCategoria[t.categoria] ?? 0) + t.valor;
});
if (Object.keys(porCategoria).length > 0) {
  const area = criarArea();
  ocuparPainel('graficoCategorias', 'vazioCategorias', area);
  const paleta = ['--sucesso', '--info', '--aviso', '--erro', '--acento', '--muted'].map(corCss);
  criarGrafico(area, {
    legend: { bottom: 0 },
    tooltip: { trigger: 'item', valueFormatter: formatarMoeda },
    series: [{
      type: 'pie',
      radius: ['50%', '72%'],
      label: { show: false },
      data: Object.entries(porCategoria).map(([name, value], i) => ({ name, value, itemStyle: { color: paleta[i % paleta.length] } })),
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

/////////////////////////////////////////////////
//  Graficos echartz mockado -- apagar depois //

const graficoReceitas = document.getElementById('graficoReceitasDespesas');
const graficoCategorias = document.getElementById('graficoCategorias');

// Dados mockados: Receitas vs Despesas
const chartReceitas = echarts.init(graficoReceitas);

chartReceitas.setOption({
    tooltip: {
        trigger: 'axis'
    },

    legend: {
        bottom: 0,
        textStyle: {
            color: '#e0e0e0'
        }
    },

    grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 55
    },

    xAxis: {
        type: 'category',
        data: ['Out/26'],
        axisLabel: {
            color: '#c0c0c0'
        },
        axisLine: {
            lineStyle: {
                color: '#777'
            }
        }
    },

    yAxis: {
        type: 'value',
        max: 3000,
        interval: 750,
        axisLabel: {
            color: '#c0c0c0',
            formatter: function (valor) {
                if (valor === 0) return 'R$ 0';
                if (valor >= 1000) {
                    return 'R$ ' + (valor / 1000).toLocaleString('pt-BR') + ' mil';
                }
                return 'R$ ' + valor;
            }
        },
        splitLine: {
            lineStyle: {
                color: '#625b50',
                type: 'dashed'
            }
        }
    },

    series: [
        {
            name: 'Receita',
            type: 'bar',
            data: [2900],
            barWidth: 16,
            itemStyle: {
                color: '#10a078',
                borderRadius: [8, 8, 0, 0]
            }
        },
        {
            name: 'Despesa',
            type: 'bar',
            data: [1750],
            barWidth: 16,
            itemStyle: {
                color: '#e01818',
                borderRadius: [8, 8, 0, 0]
            }
        }
    ]
});

// Categorias mockadas
const dadosCategorias = [
    {
        name: 'Entretenimento',
        value: 86,
        itemStyle: {
            color: '#10a078'
        }
    },
    {
        name: 'Compras',
        value: 14,
        itemStyle: {
            color: '#1456b8'
        }
    }
];

// Dados mockados: Divisão por Categoria
const chartCategorias = echarts.init(graficoCategorias);

chartCategorias.setOption({
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
    },

    legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
            color: '#e0e0e0',
            fontSize: 14
        },
        formatter: function (nome) {
            const item = dadosCategorias.find(item => item.name === nome);
            return nome + '    ' + item.value + '%';
        }
    },

    series: [
        {
            name: 'Despesas',
            type: 'pie',
            radius: ['35%', '58%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: true,

            itemStyle: {
                borderColor: '#141616',
                borderWidth: 2
            },

            label: {
                show: false
            },

            data: dadosCategorias
        }
    ]
});

// Ajusta os gráficos quando a janela muda de tamanho
window.addEventListener('resize', function () {
    chartReceitas.resize();
    chartCategorias.resize();
});

