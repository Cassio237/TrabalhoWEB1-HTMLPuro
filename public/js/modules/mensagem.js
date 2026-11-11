export function mostrarMensagem(elemento, texto, sucesso = false) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${sucesso ? 'mensagem-sucesso' : 'mensagem-erro'}`;
  elemento.hidden = false;
}

export function esconderMensagem(elemento) {
  elemento.hidden = true;
}