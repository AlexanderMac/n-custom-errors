# n-custom-errors
Custom errors for Node.js.

[![Build Status](https://travis-ci.org/AlexanderMac/n-custom-errors.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-custom-errors)

### Features
- possibility to register custom errors with name, code and error message.
- template string for formatting error message.
- a few helper functions for each registered error:
  - `get<errorName>Error()`
  - `rejectWith<errorName>Error()`
  - `is<errorName>Error()`

### Setting up

```sh
# Add to project
$ npm i -S n-custom-errors
```

### Usage

```js
// Register errors:
customErrors.registerError('AccessDenied', 403);
customErrors.registerError('DuplicateObject', 409);
customErrors.registerError('ObjectNotFound', 404, '${objectName} is not found');

// Creating custom errors:
var objectNotFoundError = customErrors.getObjectNotFoundError({ objectName: 'user' });
var duplicateObjectError = customErrors.getDuplicateObjectError('The email is not unique');

console.log(objectNotFoundError1);
/*
prints => {
  name: 'ObjectNotFoundError',
  message: 'user is not found',
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
var err = new Error();
var objectNotFoundError = customErrors.getObjectNotFoundError({ objectName: 'user' });
customErrors.isObjectNotFoundError(err)); // returns false
customErrors.isObjectNotFoundError(objectNotFoundError)); // returns true

// Rejecting with custom error (helpful in promises chain):
usersSrvc
  .getUser(userId)
  .then(user => {
    if (!user) {
      return customErrors.rejectWithObjectNotFoundError('user'));
    }
    return user;
  })
  .catch(err => {
    if (!customErrors.isObjectNotFoundError(err)) {
      // do something if err is unexpected error
    }
  });
```


### API

- **registerError(name, statusCode, messageTemplate)**<br>
Registers a new custom error.

  - `name` - error name, **required**, must be an unique. Name must be without `Error` postfix.
  - `statusCode` - http status code for error.
  - `messageTemplate` - template for a message, must contains parameters in the following format: `${objectName} is not found`. To pass the parameters to the template, parameters must be an object with defined properties: `customErrors.getObjectNotFoundError({ objectName: 'user' })`. If parameters is a string, than this string will be used in an error message without template: `customErrors.getObjectNotFoundError('User with a name user1 is not found, please use another filter')`.

- **isKnownError(err) **<br>
Returns `true` if `err` is a registered custom error, `false` otherwise.

  - `err` - error object, **required**.

- **get<errorName>Error(msg)**<br>
*This function is added automatically when a new custom error is registered*. Creates a custom error with message `msg`, it can be the parameters object if an error is registered with `messageTemplate`.

  - `msg` - an error message, **required**.

- **get<errorName>ErrorType()**<br>
*This function is added automatically when a new custom error is registered*. Gets a custom error type.

- **rejectWith<errorName>Error(msg)**<br>
*This function is added automatically when a new custom error is registered*. Rejects promise with a custom error and a message.

  - `msg` - an error message, **required**.

- **is<errorName>Error(err)**<br>
*This function is added automatically when a new custom error is registered*. Returns `true` if `err` is a custom error, `false` otherwise.

  - `err` - error object, **required**.


### Author
Alexander Mac


### License
[MIT License](license.md)
