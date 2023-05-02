import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
