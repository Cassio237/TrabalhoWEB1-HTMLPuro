const db = require('../config/database');

const selecionarPorEmail = db.prepare(
  'SELECT id, nome, email, senha, foto_url FROM usuarios WHERE email = ?'
);
const selecionarPorId = db.prepare(
  'SELECT id, nome, email, foto_url FROM usuarios WHERE id = ?'
);
const inserir = db.prepare(
  'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?) RETURNING id, nome, email, foto_url'
);

async function buscarPorEmail(email) {
  return selecionarPorEmail.get(email) || null;
}

async function buscarPorId(id) {
  return selecionarPorId.get(id) || null;
}

async function criar({ nome, email, senhaHash }) {
  return inserir.get(nome, email, senhaHash);
}

module.exports = { buscarPorEmail, buscarPorId, criar };