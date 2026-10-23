const botaoTema = document.getElementById('btnTema');
const raiz = document.documentElement;


function alternarTema(tema) {
    raiz.dataset.theme = tema;
    botaoTema.setAttribute('aria-pressed', tema === 'dark');
    try {
        localStorage.setItem('tema', tema);
    } catch (e) { }
}

botaoTema.addEventListener('click', () => {
  alternarTema(raiz.dataset.theme === 'dark' ? 'light' : 'dark');
});
