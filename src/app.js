require('dotenv').config();
const db = require('./config/database');
const express = require('express');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./routes/authRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const transacaoRoutes = require('./routes/transacaoRoutes');
const orcamentoRoutes = require('./routes/orcamentoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', authRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api', notFound);   // 404 só para rotas /api inexistentes
app.use(errorHandler);       // sempre por último

const server = app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

function encerrar() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);