'use strict';

module.exports = class BaseError extends Error {
  constructor(message, statusCode, details) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.details = details;
  }
};