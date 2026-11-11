const Sessao = (() => {
  const CHAVE = 'token';

  const salvar = (token) => localStorage.setItem(CHAVE, token);
  const obter = () => localStorage.getItem(CHAVE);
  const limpar = () => localStorage.removeItem(CHAVE);

  function sair() {
    limpar();
    window.location.href = '/index.html';
  }

  async function fetchAutenticado(url, opcoes = {}) {
    const resp = await fetch(url, {
      ...opcoes,
      headers: { ...opcoes.headers, Authorization: `Bearer ${obter()}` },
    });
    if (resp.status === 401) sair(); // token ausente, inválido ou expirado
    return resp;
  }

  // chamar no topo de cada página do dashboard; devolve o usuário logado
  async function protegerPagina() {
    if (!obter()) return sair();
    try {
      const resp = await fetchAutenticado('/api/me');
      if (!resp.ok) return sair();
      const json = await resp.json();
      return json.data.usuario;
    } catch (err) {
      sair();
    }
  }

  async function redirecionarSeLogado() {
    if (!obter()) return;
    try {
      const resp = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${obter()}` },
      });
      if (resp.ok) window.location.href = '/dashboard/painel.html';
      else limpar(); // token expirado ou usuário inexistente: fica no login
    } catch (err) {
      // servidor fora do ar: fica na tela de login
    }
  }

  return { salvar, obter, limpar, sair, fetchAutenticado, protegerPagina, redirecionarSeLogado };
})();
