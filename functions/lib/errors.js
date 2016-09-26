'use strict';

const createError = require('create-error');

const InvalidTokenError = createError('InvalidTokenError');
const OAuthError = createError('OAuthError');
const NoPhotosError = createError('NoPhotosError');

const errorToJsonAndLog = (e) => {
  console.log('Logging Error: ', e, e.stack);

  return JSON.stringify({
    name: e.name,
    message: e.message
  });
};

module.exports = {
  errorToJsonAndLog,
  InvalidTokenError,
  OAuthError,
  NoPhotosError
};
