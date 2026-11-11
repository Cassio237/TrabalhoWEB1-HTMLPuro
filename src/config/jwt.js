const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET não definido no .env');

module.exports = { secret, expiresIn: process.env.JWT_EXPIRES_IN || '2h' };