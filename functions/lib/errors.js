const createError = require('create-error');

const EmptyEventError = createError('EmptyEventError');
const InvalidDateError = createError('InvalidDateError');
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

const generateSlackErrorResponse = (e) => {
  const errorResponse = {
    response_type: 'ephemeral',
    text: 'There was an error with your previous command. Review the error and try again.',
    attachments: [
      {
        fallback: e.message,
        text: e.message,
        color: '#FC3D21'
      }
    ]
  };

  return errorResponse;
};

module.exports = {
  EmptyEventError,
  errorToJsonAndLog,
  generateSlackErrorResponse,
  InvalidDateError,
  InvalidTokenError,
  NoPhotosError,
  OAuthError
};
