// ===================== NÚMERO DO ORÇAMENTO E DATA ===================== //
// Provisório: gerado no front só para visualização.
// Quando o back-end existir, o número real deve vir do banco (garantindo unicidade).
const numeroOrcamentoInput = document.getElementById('numeroOrcamento');
const dataOrcamentoInput = document.getElementById('dataOrcamento');

const numeroProvisorio = 1000; // TODO: substituir pela consulta ao back-end
numeroOrcamentoInput.value = numeroProvisorio;

const hoje = new Date().toISOString().split('T')[0];
dataOrcamentoInput.value = hoje;

// ===================== LOGO ===================== //
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');

logoInput.addEventListener('change', () => {
  const arquivo = logoInput.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (e) => {
    logoPreview.src = e.target.result;
    logoPreview.classList.add('has-image');
  };
  leitor.readAsDataURL(arquivo);
});

// ===================== TABELA DE SERVIÇOS ===================== //
const tabelaServicosBody = document.getElementById('tabelaServicosBody');
const btnAdicionarLinha = document.getElementById('btnAdicionarLinha');
const valorServicosInput = document.getElementById('valorServicos');

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarLinhaServico() {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td><input type="text" class="input-tipo"></td>
    <td><input type="text" class="input-descricao"></td>
    <td><input type="number" class="input-valor-unitario" min="0" step="0.01"></td>
    <td><input type="number" class="input-quantidade" min="0" step="1"></td>
    <td><input type="text" class="input-valor-total-linha" readonly></td>
    <td>
      <button type="button" class="btn-remover-linha" title="Remover linha">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>
      </button>
    </td>
  `;

  const valorUnitarioInput = tr.querySelector('.input-valor-unitario');
  const quantidadeInput = tr.querySelector('.input-quantidade');
  const valorTotalLinhaInput = tr.querySelector('.input-valor-total-linha');
  const btnRemoverLinha = tr.querySelector('.btn-remover-linha');

  function atualizarLinha() {
    const valorUnitario = parseFloat(valorUnitarioInput.value) || 0;
    const quantidade = parseFloat(quantidadeInput.value) || 0;
    const total = valorUnitario * quantidade;
    valorTotalLinhaInput.value = formatarMoeda(total);
    atualizarValorServicos();
  }

  valorUnitarioInput.addEventListener('input', atualizarLinha);
  quantidadeInput.addEventListener('input', atualizarLinha);

  btnRemoverLinha.addEventListener('click', () => {
    tr.remove();
    atualizarValorServicos();
  });

  return tr;
}

function adicionarLinha() {
  tabelaServicosBody.appendChild(criarLinhaServico());
}

// 5 linhas iniciais
for (let i = 0; i < 3; i++) {
  adicionarLinha();
}

btnAdicionarLinha.addEventListener('click', adicionarLinha);

// ===================== CONDIÇÕES DE PAGAMENTO ===================== //
const descontoValorInput = document.getElementById('descontoValor');
const descontoTipoPercentual = document.getElementById('descontoTipoPercentual');
const descontoTipoMonetario = document.getElementById('descontoTipoMonetario');
const valorTotalFinalInput = document.getElementById('valorTotalFinal');

function obterValorServicos() {
  const linhas = tabelaServicosBody.querySelectorAll('tr');
  let soma = 0;

  linhas.forEach((linha) => {
    const valorUnitario = parseFloat(linha.querySelector('.input-valor-unitario').value) || 0;
    const quantidade = parseFloat(linha.querySelector('.input-quantidade').value) || 0;
    soma += valorUnitario * quantidade;
  });

  return soma;
}

function atualizarValorServicos() {
  const totalServicos = obterValorServicos();
  valorServicosInput.value = formatarMoeda(totalServicos);
  atualizarValorTotalFinal(totalServicos);
}

function atualizarValorTotalFinal(totalServicos) {
  const desconto = parseFloat(descontoValorInput.value) || 0;
  let totalFinal = totalServicos;

  if (descontoTipoPercentual.checked) {
    totalFinal = totalServicos - (totalServicos * desconto / 100);
  } else {
    totalFinal = totalServicos - desconto;
  }

  if (totalFinal < 0) totalFinal = 0;

  valorTotalFinalInput.value = formatarMoeda(totalFinal);
}

descontoValorInput.addEventListener('input', () => atualizarValorTotalFinal(obterValorServicos()));
descontoTipoPercentual.addEventListener('change', () => atualizarValorTotalFinal(obterValorServicos()));
descontoTipoMonetario.addEventListener('change', () => atualizarValorTotalFinal(obterValorServicos()));

// Inicializa os totais com os valores das 5 linhas iniciais (zeradas)
atualizarValorServicos();

// ===================== MODAL: CARREGAR CLIENTE ===================== //
const modalClientes = document.getElementById('modalClientes');
const btnCarregarCliente = document.getElementById('btnCarregarCliente');
const btnFecharModal = document.getElementById('btnFecharModal');
const modalListaClientes = document.getElementById('modalListaClientes');
const modalListaVazia = document.getElementById('modalListaVazia');
const modalBuscaCliente = document.getElementById('modalBuscaCliente');

// Quando o back-end de clientes existir, troque isso por um fetch:
// const clientesCadastrados = await fetch('/api/clientes').then(r => r.json());
const clientesCadastrados = [];

function abrirModalClientes() {
  renderizarListaClientes(clientesCadastrados);
  modalClientes.classList.add('active');
}

function fecharModalClientes() {
  modalClientes.classList.remove('active');
  modalBuscaCliente.value = '';
}

function renderizarListaClientes(lista) {
  modalListaClientes.innerHTML = '';

  if (lista.length === 0) {
    modalListaVazia.style.display = 'block';
    modalListaClientes.style.display = 'none';
    return;
  }

  modalListaVazia.style.display = 'none';
  modalListaClientes.style.display = 'block';

  lista.forEach((cliente) => {
    const li = document.createElement('li');
    li.textContent = `${cliente.razaoSocial} — ${cliente.cpfCnpj}`;
    li.addEventListener('click', () => selecionarCliente(cliente));
    modalListaClientes.appendChild(li);
  });
}

function selecionarCliente(cliente) {
  document.getElementById('clienteRazaoSocial').value = cliente.razaoSocial;
  document.getElementById('clienteCpfCnpj').value = cliente.cpfCnpj;
  document.getElementById('clienteEndereco').value = cliente.endereco;
  document.getElementById('clienteTelefone').value = cliente.telefone;
  fecharModalClientes();
}

btnCarregarCliente.addEventListener('click', abrirModalClientes);
btnFecharModal.addEventListener('click', fecharModalClientes);

// Fecha o modal clicando fora do card
modalClientes.addEventListener('click', (e) => {
  if (e.target === modalClientes) fecharModalClientes();
});

modalBuscaCliente.addEventListener('input', () => {
  const termo = modalBuscaCliente.value.toLowerCase();
  const filtrados = clientesCadastrados.filter((c) =>
    c.razaoSocial.toLowerCase().includes(termo) || c.cpfCnpj.includes(termo)
  );
  renderizarListaClientes(filtrados);
});

// ===================== SALVAR ===================== //
const orcamentoForm = document.getElementById('orcamentoForm');
const btnSalvarImprimir = document.getElementById('btnSalvarImprimir');

orcamentoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: enviar para o back-end (POST /api/orcamentos) quando existir
  console.log('Salvar orçamento (ainda sem back-end conectado)');
});

btnSalvarImprimir.addEventListener('click', () => {
  // TODO: salvar e então acionar a versão de impressão (a definir)
  console.log('Salvar e imprimir (impressão ainda não implementada)');
});
