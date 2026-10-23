const bcrypt = require('bcrypt');
const pool = require('../config/postgres');

// POST /api/signup
async function signup(req, res) {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, username, email, senha)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, username, email`,
      [name, username, email, hash]
    );

    return res.status(201).json({ usuario: result.rows[0] });

  } catch (err) {
    // Código do Postgres para violação de UNIQUE (email ou username duplicado)
    if (err.code === '23505') {
      return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
}

// POST /api/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(password, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    // TODO: gerar e enviar o JWT aqui quando formos implementar sessão

    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        username: usuario.username,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
}

module.exports = { signup, login };