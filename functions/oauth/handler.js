'use strict';

const errorToJsonAndLog = require('../lib/errors').errorToJsonAndLog;
const slack = require('../lib/slack');

module.exports.oauth = function oauth(event, context, cb) {
  slack.exchangeCodeForToken(event)
  .then((resp) => {
    console.log(resp);
    cb(null, { location: process.env.OAUTH_SUCCESS_URL });
  })
  .catch((e) => {
    const jsonError = errorToJsonAndLog(e);
    console.log('Error in OAuth token exchange', jsonError);
    // Pass null as error param so response handler still picks up the location for 302 redirect
    cb(null, { location: process.env.OAUTH_ERROR_URL });
  });
};
