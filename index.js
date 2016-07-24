'use strict';

var _ = require('lodash');

var _customErrors = [];

exports.registerError = (name, errorCode) => {
  if (!name) {
    throw new Error('Custom error name is required');
  }
  if (_.some(_customErrors, { name })) {
    throw new Error(`Custom error ${name} is already registered`);
  }

  name = _.upperFirst(name);

  var CustomError = function(msg, info) {
    this.message = msg;
    this.info = info;
    this.errorCode = errorCode;
    this.name = name;
  };
  CustomError.prototype = new Error();

  exports[`is${name}Error`] = (err) => {
    return err instanceof CustomError;
  };
  exports[`get${name}Error`] = (msg, info) => {
    return new CustomError(msg, info);
  };
  exports[`rejectWith${name}Error`] = (msg, info) => {
    var err = exports[`get${name}Error`](msg, info);
    return Promise.reject(err);
  };

  _customErrors.push({
    name,
    type: CustomError
  });
};

exports.isKnownError = (err) => {
  return _.some(_customErrors, custErr => err instanceof custErr.type);
};
