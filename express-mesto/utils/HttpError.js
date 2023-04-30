class HttpError extends Error {
  constructor(code, name, message) {
    super(message);
    this.name = name;
    this.code = code;
  }
}

module.exports = HttpError;
