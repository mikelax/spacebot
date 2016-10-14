'use strict';

const createError = require('create-error');

const EmptyEventError = createError('EmptyEventError');
const InvalidTokenError = createError('InvalidTokenError');
const NoPhotosError = createError('NoPhotosError');
const OAuthError = createError('OAuthError');

const errorToJsonAndLog = (e) => {
  console.log('Logging Error: ', e, e.stack);

  return JSON.stringify({
    name: e.name,
    message: e.message
  });
};

module.exports = {
  EmptyEventError,
  errorToJsonAndLog,
  InvalidTokenError,
  NoPhotosError,
  OAuthError
};
