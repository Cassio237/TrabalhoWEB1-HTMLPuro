const listaOrcamentos = document.getElementById('listaOrcamentos');
const listaVaziaMsg = document.getElementById('listaVaziaMsg');

// Quando o back-end de orçamentos existir, troque isso por um fetch:
// const orcamentos = await fetch('/api/orcamentos').then(r => r.json());
const orcamentos = [];

function renderizarLista() {
  if (orcamentos.length === 0) {
    listaVaziaMsg.style.display = 'block';
    listaOrcamentos.style.display = 'none';
    return;
  }

  listaVaziaMsg.style.display = 'none';
  listaOrcamentos.style.display = 'block';
  listaOrcamentos.innerHTML = '';

  orcamentos.forEach((orc) => {
    const li = document.createElement('li');
    li.textContent = `Nº ${orc.numero} — ${orc.cliente} — ${orc.data}`;
    listaOrcamentos.appendChild(li);
  });
}

renderizarLista();
