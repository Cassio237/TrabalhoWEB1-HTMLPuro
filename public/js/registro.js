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



formRegistro.addEventListener('submit', async (event) => {
  event.preventDefault();

  const mensagem = document.getElementById('msgFeedback');
  const name = document.getElementById('nomeCriar').value.trim();
  const email = document.getElementById('emailCriar').value.trim();
  const password = document.getElementById('senhaCriar').value;
  const confirmarSenha = document.getElementById('confirmarSenhaCriar').value;

  mensagem.innerText = '';

  if (password !== confirmarSenha) {
    mensagem.innerText = 'As senhas não coincidem.';
    return;
  }

  if (password.length < 6) {
    mensagem.innerText = 'A senha deve ter ao menos 6 caracteres.';
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
      mensagem.innerText = json.message;
      return;
    }

    mensagem.innerText = 'Conta criada com sucesso! Redirecionando para o login...';
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  } catch (err) {
    mensagem.innerText = 'Não foi possível conectar ao servidor.';
  }
});