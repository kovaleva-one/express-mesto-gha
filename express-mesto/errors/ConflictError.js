import { constants } from 'http2';
import HTTPError from './HTTPError';

class ConflictError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_CONFLICT);
    this.name = 'ConflictError';
  }
}

export default ConflictError;
