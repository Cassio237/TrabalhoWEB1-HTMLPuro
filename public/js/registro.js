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



formRegistro.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputNome = document.getElementById('nome');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('senha');
  const inputConfirmarSenha = document.getElementById('confirmarSenha');
  const mensagen = document.getElementById('msgFeedback');

  mensagen.innerText = "";

  //if(inp)


  window.location.href = 'index.html';
});