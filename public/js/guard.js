Sessao.protegerPagina().then((usuario) => {
  const el = document.getElementById('nomeUsuario');
  if (usuario && el) el.textContent = usuario.nome.split(' ')[0];
});