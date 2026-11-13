// Comunicação do dashboard com o servidor. Usa o Sessao (sessao.js) para enviar o token.

async function requisitar(url, opcoes = {}) {
  const resp = await Sessao.fetchAutenticado(url, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
  });
  const json = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const detalhes = json.errors ? Object.values(json.errors).join(' ') : '';
    const erro = new Error(detalhes || json.message || 'Erro inesperado no servidor.');
    erro.status = resp.status;
    throw erro;
  }
  return json.data;
}

const enviar = (metodo, corpo) => ({ method: metodo, body: JSON.stringify(corpo) });

// ----- transações -----
export const listarTransacoes = async () => (await requisitar('/api/transacoes')).transacoes;
export const criarTransacao = async (dados) => (await requisitar('/api/transacoes', enviar('POST', dados))).transacao;
export const excluirTransacao = (id) => requisitar(`/api/transacoes/${id}`, { method: 'DELETE' });

// ----- orçamentos (cada um já vem com o "gasto" calculado pelo banco) -----
export const listarOrcamentos = async () => (await requisitar('/api/orcamentos')).orcamentos;
export const criarOrcamento = async (dados) => (await requisitar('/api/orcamentos', enviar('POST', dados))).orcamento;
export const excluirOrcamento = (id) => requisitar(`/api/orcamentos/${id}`, { method: 'DELETE' });
