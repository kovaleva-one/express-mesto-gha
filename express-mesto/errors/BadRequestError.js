import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}

export default BadRequestError;
