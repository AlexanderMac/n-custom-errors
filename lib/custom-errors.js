'use strict';

var _ = require('lodash');

var _customErrors = [];

exports.registerError = (name, statusCode, messageTemplate) => {
  _validate(name);

  name = _.upperFirst(name);
  var CustomError = _createCustomError(name, statusCode);

  _createFunctions(name, CustomError, messageTemplate);

  _customErrors.push({
    name,
    type: CustomError
  });
};

exports.isKnownError = (err) => {
  return _.some(_customErrors, custErr => err instanceof custErr.type || err === custErr.name);
};

function _validate(name) {
  if (!name) {
    throw new Error('Custom error name is required');
  }
  if (_.some(_customErrors, { name })) {
    throw new Error(`Custom error ${name} is already registered`);
  }
}

function _createCustomError(name, statusCode) {
  var CustomError = function(msg) {
    this.name = name + 'Error';
    this.message = msg;
    this.statusCode = statusCode;
  };
  CustomError.prototype = new Error();

  return CustomError;
}

function _createFunctions(name, CustomError, messageTemplate) {
  exports[`is${name}Error`] = (err) => err instanceof CustomError;

  exports[`get${name}ErrorType`] = () => CustomError;

  exports[`get${name}Error`] = (msg) => {
    if (messageTemplate && !_.isString(msg) && _.isObject(msg)) {
      var msgParams = msg;
      msg = _.reduce(msgParams, (result, paramVal, paramKey) => {
        result = _.replace(result, '${' + paramKey + '}', paramVal);
        return result;
      }, messageTemplate);
    }
    return new CustomError(msg);
  };

  exports[`rejectWith${name}Error`] = (msg) => {
    var err = exports[`get${name}Error`](msg);
    return Promise.reject(err);
  };
}
