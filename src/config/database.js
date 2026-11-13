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
`);

module.exports = db;