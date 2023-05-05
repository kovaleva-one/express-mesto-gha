const { constants } = require('http2');
const HTTPError = require('./HTTPError');

class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
