// descomentar quando o BD existir
// const pool = require('../config/postgres');

//const usuarios = [];
//let proximoId = 1;

//Remover quando bd existir
const bcrypt = require('bcrypt');
const usuarios = [
  {
    id: 1,
    nome: 'Dev Teste',
    email: 'teste@gmail.com',
    senha: bcrypt.hashSync('teste123', 10),
  },
];
let proximoId = 2;
//Remover quando bd existir

async function buscarPorEmail(email) {
  // const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  // return rows[0] || null;
  return usuarios.find((u) => u.email === email) || null;
}

async function criar({ nome, email, senhaHash }) {
  // const { rows } = await pool.query(
  //   `INSERT INTO usuarios (nome, username, email, senha)
  //    VALUES ($1, $2, $3, $4) RETURNING *`,
  //   [nome, username, email, senhaHash]
  // );
  // return rows[0];
  const usuario = { id: proximoId++, nome, email, senha: senhaHash };
  usuarios.push(usuario);
  return usuario;
}

module.exports = { buscarPorEmail, criar };