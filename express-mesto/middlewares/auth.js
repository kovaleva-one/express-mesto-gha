import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

function auth(req, res, next) {
  const { cookies } = req;

  if (cookies && cookies.jwt) {
    const token = cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
    } catch (e) {
      next(new UnauthorizedError('Передан неверифицированый токен'));
    }
    req.user = payload;
    next();
  } else {
    next(new UnauthorizedError('Отсутствует авторизационный заголовок или cookies'));
  }
}

export default auth;
