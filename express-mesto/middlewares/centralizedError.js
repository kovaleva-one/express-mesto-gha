import { constants } from 'http2';

function centralizedError(err, req, res, next) {
  let {
    statusCode,
    message,
  } = err;
  if (!statusCode) {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    message = 'На сервере произошла ошибка';
  }
  res.status(statusCode)
    .send({ message });
  next();
}

export default centralizedError;
