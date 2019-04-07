# n-custom-errors
Custom errors for Node.js.

[![Build Status](https://travis-ci.org/AlexanderMac/n-custom-errors.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-custom-errors)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/n-custom-errors/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/n-custom-errors)
[![npm version](https://badge.fury.io/js/n-custom-errors.svg)](https://badge.fury.io/js/n-custom-errors)

## Features
- custom errors with name, code and error message.
- template strings for formatting error messages.
- helper functions for each registered error:
  - `get<errorName>Error()`
  - `get<errorName>ErrorType()`
  - `throw<errorName>Error()`
  - `is<errorName>Error()`
- predefined HTTP errors:
  - `AccessDeniedError`
  - `BusinessLogicError`
  - `DbValidationError`
  - `DuplicateObjectError`
  - `ObjectNotFoundError`
  - `ThirdPartyServiceError`
  - `UnauthorizedRequestError`
  - `UnprocessableRequestError`

## Setting up

```sh
# Add to project
$ npm i n-custom-errors
```

## Usage

```js
// Registering errors:
customErrors.registerError('AccessDenied', 403);
customErrors.registerError('DuplicateObject', 409);
customErrors.registerError('ObjectNotFound', 404, '${objectName} not found');

// Creating custom errors:
let objectNotFoundError = customErrors.getObjectNotFoundError({ objectName: 'user' });
let duplicateObjectError = customErrors.getDuplicateObjectError('The email is not unique');

console.log(objectNotFoundError);
/*
prints => {
  name: 'ObjectNotFoundError',
  message: 'user not found',
  statusCode: 404
}*/
console.log(duplicateObjectError);
/*
prints => {
  name: 'DuplicateObjectError',
  message: 'The email is not unique',
  statusCode: 409
}*/

// Checking that an error is a custom error:
let err = new Error();
let objectNotFoundError = customErrors.getObjectNotFoundError({ objectName: 'user' });
customErrors.isObjectNotFoundError(err)); // returns false
customErrors.isObjectNotFoundError(objectNotFoundError)); // returns true

// Using predefined HTTP errors
const customErrors = require('n-custom-errors');

customErrors.predefined.http.register();
```

## API

- **registerError(name, statusCode, messageTemplate)**<br>
Registers a new custom error.

  - `name` - error name, **required**, must be an unique. Name must be without `Error` postfix.
  - `statusCode` - http status code for error.
  - `messageTemplate` - template for a message, must contains parameters in the following format: `${objectName} not found`. To pass the parameters to the template, parameters must be an object with defined properties: `customErrors.getObjectNotFoundError({ objectName: 'user' })`. If parameters is a string, than this string will be used in an error message without template: `customErrors.getObjectNotFoundError('User with a name user1 not found, please use another filter')`.

- **isKnownError(err)**<br>
Returns `true` if `err` is a registered custom error, `false` otherwise.

  - `err` - error object, **required**.

- **get\<errorName\>Error(msg)**<br>
*This function is added automatically when a new custom error is registered*.<br>
Creates a custom error with message `msg`, it can be the parameters object if an error is registered with `messageTemplate`.

  - `msg` - an error message, **required**.

- **get\<errorName\>ErrorType()**<br>
*This function is added automatically when a new custom error is registered*.<br>
Gets a custom error type.

- **throw\<errorName\>Error(msg)**<br>
*This function is added automatically when a new custom error is registered*.
<br>Throws a custom error with a message.

  - `msg` - an error message, **required**.

- **is\<errorName\>Error(err)**<br>
*This function is added automatically when a new custom error is registered*.
<br>Returns `true` if `err` is a custom error, `false` otherwise.

  - `err` - error object, **required**.

- **predefined.http.register()**<br>
<br>Register predefined htpp errors.

## Author
Alexander Mac

## License
Licensed under the MIT license.
