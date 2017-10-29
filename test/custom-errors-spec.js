'use strict';

var should       = require('should');
var rewire       = require('rewire');
var customErrors = rewire('../src/custom-errors');

should.config.checkProtoEql = false;

/* eslint new-cap: off */
describe('errors', () => {
  beforeEach(() => {
    customErrors.__set__('_customErrors', []);
  });

  describe('registerError',() => {
    function test1(name, code, template, expectedErrors) {
      customErrors.registerError(name, code, template);

      const actualErrors = customErrors.__get__('_customErrors');
      should(actualErrors).eql(expectedErrors);

      const actualError = new (actualErrors[0].type)('Test');
      const expectedError = new (expectedErrors[0].type)('Test');
      should(actualError).eql(expectedError);
    }

    function test2(name, code, template, expectedErrorMessage) {
      should(customErrors.registerError.bind(null, name, code, template)).throw(expectedErrorMessage);
    }

    it('should register a new unique customError', () => {
      const name = 'AccessDenied';
      const code = 403;
      const template = '${user} has\'t access to this data';
      const expectedErrors = [{
        name,
        type: customErrors.__get__('_createCustomError')(name, code)
      }];

      test1(name, code, template, expectedErrors);
    });

    it('should throw an error if the name is not defined', () => {
      const name = null;
      const code = 403;
      const template = '${user} has\'t access to this data';
      const expectedErrorMessage = 'Custom error name is required';

      test2(name, code, template, expectedErrorMessage);
    });

    it('should throw an error if the customError is already registered', () => {
      const name = 'AccessDenied';
      const code = 403;
      const template = '${user} has\'t access to this data';
      const expectedErrorMessage = `Custom error ${name} is already registered`;

      customErrors.__set__('_customErrors', [{ name }]);

      test2(name, code, template, expectedErrorMessage);
    });
  });

  describe('isKnownError', function() {
    beforeEach(() => {
      customErrors.registerError('AccessDenied', 403);
      customErrors.registerError('ObjectNotFound', 404);
    });

    function test(err, expected) {
      const actual = customErrors.isKnownError(err);
      should(actual).eql(expected);
    }

    it('should return false when err isn\'t an instance of ObjectNotFoundError', () => {
      const err = new Error('Test Error');
      const expected = false;

      test(err, expected);
    });

    it('should return true when err is an instance of ObjectNotFoundError', function() {
      const err = customErrors.getObjectNotFoundError('Test Error');
      const expected = true;

      test(err, expected);
    });

    it('should return true when err is a name of ObjectNotFoundError type', function() {
      const err = 'ObjectNotFound';
      const expected = true;

      test(err, expected);
    });
  });

  describe('Helpers', () => {
    beforeEach(() => {
      const name = 'AccessDenied';
      const code = 403;
      const template = '${user} has\'t access to this data';

      customErrors.registerError(name, code, template);
    });

    describe('is<name>Error', () => {
      it('should return false when err is an instance of AccessDeniedError', () => {
        let err = new Error('test');
        let actual = customErrors.isAccessDeniedError(err);
        let expected = false;

        should(actual).equal(expected);
      });

      it('should return true when err is an instance of AccessDeniedError', () => {
        let err = customErrors.getAccessDeniedError('test');
        let actual = customErrors.isAccessDeniedError(err);
        let expected = true;

        should(actual).equal(expected);
      });
    });

    describe('get<name>ErrorType', () => {
      it('should return customError type', () => {
        let actual = customErrors.getAccessDeniedErrorType();
        let expected = customErrors.__get__('_customErrors')[0].type;

        should(actual).equal(expected);
      });
    });

    describe('get<name>Error', () => {
      it('should return an instance of customError type', () => {
        let actual = customErrors.getAccessDeniedError({ user: 'user1' });
        let expected = new (customErrors.__get__('_customErrors')[0].type)('user1 has\'t access to this data');

        should(actual).eql(expected);
      });
    });

    describe('rejectWith<name>Error', () => {
      it('should reject promise with an instance of customError type', (done) => {
        let actual = customErrors.rejectWithAccessDeniedError({ user: 'user1' });
        let expected = new (customErrors.__get__('_customErrors')[0].type)('user1 has\'t access to this data');

        Promise
          .resolve()
          .then(() => actual)
          .then(() => done(new Error('Unexpected promise fulfill')))
          .catch(err => {
            should(err).eql(expected);
            done();
          })
          .catch(done);
      });
    });
  });
});
