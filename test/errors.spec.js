const chai = require('chai');
const errors = require('../functions/lib/errors');
const should = require('chai').should();

describe('Error Handling', () => {
  describe('errorToJsonAndLog', () => {
    it('should return a JSON string for NoPhotosError', () => {
      const err = new errors.NoPhotosError('Test message');
      const string = errors.errorToJsonAndLog(err);
      string.should.be.a('string').that.contains('NoPhotosError')
        .and.contains('Test message');
    });
  });
});
