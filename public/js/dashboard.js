// Comportamento comum a todas as telas internas: menu lateral e botão de sair.

const menu = document.getElementById('menuLateral');
const overlay = document.getElementById('overlayMenu');
const btnAbrir = document.getElementById('btnAbrirMenu');
const btnFechar = document.getElementById('btnFecharMenu');
const btnSair = document.getElementById('btnSair');

function abrirMenu() {
  menu.classList.add('aberto');
  overlay.classList.add('visivel');
  btnAbrir.setAttribute('aria-expanded', 'true');
  btnFechar.focus();
}

function fecharMenu() {
  if (!menu.classList.contains('aberto')) return;
  menu.classList.remove('aberto');
  overlay.classList.remove('visivel');
  btnAbrir.setAttribute('aria-expanded', 'false');
  btnAbrir.focus();
}

btnAbrir.addEventListener('click', abrirMenu);
btnFechar.addEventListener('click', fecharMenu);
overlay.addEventListener('click', fecharMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenu();
});

btnSair.addEventListener('click', () => {
  window.location.href = '../index.html';
});
