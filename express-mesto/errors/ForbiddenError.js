import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class ForbiddenError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
