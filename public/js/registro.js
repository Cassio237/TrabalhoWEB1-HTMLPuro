const botoesToggle = document.querySelectorAll('.btn-toggle-senha');
const formRegistro = document.getElementById('formRegistro');

botoesToggle.forEach((botao) => {
  botao.addEventListener('click', () => {
    const campo = botao.closest('.senha-container').querySelector('input');
    const icone = botao.querySelector('i');
    const mostrando = campo.type === 'text';

    campo.type = mostrando ? 'password' : 'text';
    botao.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
    icone.className = mostrando ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill';
  });
});

function mostrarMensagem(elemento, texto, sucesso = false) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${sucesso ? 'mensagem-sucesso' : 'mensagem-erro'}`;
  elemento.hidden = false;
}

formRegistro.addEventListener('submit', async (event) => {
  event.preventDefault();

  const msgRegistro = document.getElementById('msgFeedback');
  const name = document.getElementById('nomeCriar').value.trim();
  const email = document.getElementById('emailCriar').value.trim();
  const password = document.getElementById('senhaCriar').value;
  const confirmarSenha = document.getElementById('confirmarSenhaCriar').value;

  if (password !== confirmarSenha) {
    mostrarMensagem(msgRegistro, 'As senhas não coincidem.');
    return;
  }

  if (password.length < 6) {
    mostrarMensagem(msgRegistro, 'A senha deve ter ao menos 6 caracteres.');
    return;
}

  try {
    const resp = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await resp.json();


    if (!resp.ok) {
      msgRegistro.innerText = json.message;
      return;
    }

    mostrarMensagem(msgRegistro, 'Conta criada com sucesso! Redirecionando para o login...', true);
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  } catch (err) {
    mostrarMensagem(msgRegistro, 'Não foi possível conectar ao servidor.');
  }
});