import { constants } from 'http2';
import HTTPError from './HTTPError';

class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
