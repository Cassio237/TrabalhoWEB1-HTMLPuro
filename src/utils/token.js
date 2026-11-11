const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

function gerarToken(usuario) {
  return jwt.sign(
    { sub: String(usuario.id), email: usuario.email },
    secret,
    { algorithm: 'HS256', expiresIn }
  );
}

function verificarToken(token) {
  // lança TokenExpiredError ou JsonWebTokenError se não for válido
  return jwt.verify(token, secret, { algorithms: ['HS256'] });
}

module.exports = { gerarToken, verificarToken };