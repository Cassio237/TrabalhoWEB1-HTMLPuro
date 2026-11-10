//no Express 4, erros de funções async precisam ser repassados ao next, 
//(Nao confundir com Next.js do projeto original, isso é uma ferramente do Express)

module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);