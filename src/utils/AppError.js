class AppError extends Error {
  constructor(message, status = 500, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors; // detalhes por campo (opcional)
  }
}
module.exports = AppError;