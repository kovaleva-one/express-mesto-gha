const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Authorization required');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret', { expiresIN: '7d' });
  } catch (err) {
    throw new UnauthorizedError('Authorization required');
  }
  req.user = payload;
  next();
};
