const form = document.getElementById('alterarDados');
const btnEditar = document.getElementById('btnEditar');
const lblEditar = document.getElementById('lblEditar');
const icoEditar = document.getElementById('icoEditar');
const inpNome = document.getElementById('userNome');

const modal = document.getElementById('modalCodigo');
const formCodigo = document.getElementById('formCodigo');
const inpCodigo = document.getElementById('inpCodigo');
const erroCodigo = document.getElementById('erroCodigo');

let editando = false;

// SÓ PARA TESTE: a verificação de verdade precisa ser feita no servidor (api.js),
// que envia o código por e-mail e confere o que o usuário digitou.
const CODIGO_TESTE = '123456';

// retorna true ou false
function codigoEhValido(codigo) {
  return codigo === CODIGO_TESTE;
}

function habilitarEdicao() {
  [...form.elements].forEach((campo) => (campo.disabled = false)); // inputs e botão de confirmar
  editando = true;
  lblEditar.textContent = 'Salvar';
  icoEditar.className = 'bi bi-check-lg';
  inpNome.focus();
}

// o mesmo botão tem dois papéis: pedir o código e, depois, salvar
btnEditar.addEventListener('click', () => {
  if (editando) {
    form.requestSubmit();
  } else {
    modal.showModal();
  }
});

// fechar a janela (X, Cancelar e clique no fundo)
document.getElementById('btnFecharModalCodigo').addEventListener('click', () => modal.close());
document.getElementById('btnCancelarCodigo').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

// qualquer forma de fechar limpa o campo e o aviso
modal.addEventListener('close', () => {
  inpCodigo.value = '';
  erroCodigo.hidden = true;
});

// confirmar o código
formCodigo.addEventListener('submit', (e) => {
  e.preventDefault();
  if (codigoEhValido(inpCodigo.value.trim())) {
    modal.close();
    habilitarEdicao();
  } else {
    erroCodigo.hidden = false;
    inpCodigo.select();
  }
});

// salvar: por enquanto só impede o recarregamento da página
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // aqui entra o envio dos dados ao servidor (api.js)
});
