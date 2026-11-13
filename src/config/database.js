const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const caminho = path.resolve(
  process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'app.db')
);
fs.mkdirSync(path.dirname(caminho), { recursive: true });

const db = new DatabaseSync(caminho);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE COLLATE NOCASE,
    senha     TEXT NOT NULL,
    foto_url  TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transacoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    valor_centavos  INTEGER NOT NULL CHECK (valor_centavos > 0),
    categoria       TEXT NOT NULL,
    descricao       TEXT NOT NULL,
    data            TEXT NOT NULL,
    criado_em       TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_transacoes_usuario_data ON transacoes (usuario_id, data);

  CREATE TABLE IF NOT EXISTS orcamentos (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria      TEXT NOT NULL,
    mes            INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    ano            INTEGER NOT NULL,
    limite_centavos INTEGER NOT NULL CHECK (limite_centavos > 0),
    criado_em      TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (usuario_id, categoria, mes, ano)
  );
`);

module.exports = db;
