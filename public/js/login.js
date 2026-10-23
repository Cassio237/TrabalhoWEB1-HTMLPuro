const botaoTglSenha = document.getElementById('btnToggleSenha');
botaoTglSenha.addEventListener('click', () => {
    const inputSenha = document.getElementById('senhaEntrada');
    const tipo = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
    const icone = botaoTglSenha.querySelector('i');
    inputSenha.setAttribute('type', tipo);
    botaoTglSenha.setAttribute('aria-label', tipo === 'password' ? 'Mostrar senha' : 'Ocultar senha');
    icone.className = tipo === 'password' ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill';
});

const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = 'dashboard/painel.html';
});

// autofocus, evita tela mobile
document.addEventListener("DOMContentLoaded", () => {
    const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const input = document.getElementById("emailEntrada");
    if (temMouse.matches && input) {
        input.focus();
    }
});
// ----- recuperar senha -----
const modalRecuperar = document.getElementById('modalRecuperar');
const formRecuperar = document.getElementById('formRecuperar');
const inpEmailRecuperar = document.getElementById('emailRecuperar');
const msgRecuperar = document.getElementById('msgRecuperar');

// SÓ PARA TESTE: depois isso vira uma consulta à API, que fala com o banco
const EMAILS_TESTE = ['teste@email.com'];

// retorna true ou false
function emailExiste(email) {
    return EMAILS_TESTE.includes(email.toLowerCase());
}

function mostrarMensagemRecuperar(texto, sucesso) {
    msgRecuperar.textContent = texto;
    msgRecuperar.className = `mensagem ${sucesso ? 'mensagem-sucesso' : 'mensagem-erro'}`;
    msgRecuperar.hidden = false;
}

document.getElementById('btnRecuperarSenha').addEventListener('click', () => {
    modalRecuperar.showModal();
});

// fechar a janela (X, Cancelar e clique no fundo)
document.getElementById('btnFecharModalRecuperar').addEventListener('click', () => modalRecuperar.close());
document.getElementById('btnCancelarRecuperar').addEventListener('click', () => modalRecuperar.close());
modalRecuperar.addEventListener('click', (event) => {
    if (event.target === modalRecuperar) modalRecuperar.close();
});

// qualquer forma de fechar limpa o campo e a mensagem
modalRecuperar.addEventListener('close', () => {
    formRecuperar.reset();
    msgRecuperar.hidden = true;
});

formRecuperar.addEventListener('submit', (event) => {
    event.preventDefault();
    if (emailExiste(inpEmailRecuperar.value.trim())) {
        mostrarMensagemRecuperar('Enviamos as instruções para o seu email.', true);
    } else {
        mostrarMensagemRecuperar('Email não existe.', false);
    }
});
