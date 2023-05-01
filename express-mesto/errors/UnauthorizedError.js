import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

export default UnauthorizedError;
