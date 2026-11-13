const AppError = require('../utils/AppError');
const { verificarToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new AppError('Token não informado.', 401));
  }

  try {
    const payload = verificarToken(token);
    req.usuario = { id: Number(payload.sub), email: payload.email };
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Sessão expirada. Faça login novamente.'
      : 'Token inválido.';
    next(new AppError(msg, 401));
  }
};