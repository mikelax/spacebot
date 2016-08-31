'use strict';

const errorToJsonAndLog = require('../lib/errors').errorToJsonAndLog;
const slack = require('../lib/slack');

module.exports.oauth = function oauth(event, context, cb) {
  // TODO check for event.error and raise error
  const oauthCode = event.code;

  slack.exchangeCodeForToken(oauthCode)
  .then(resp => {
    // TODO 302 redirect to homepage
    cb(null, resp);
  })
  .catch(e => cb(errorToJsonAndLog(e)));
};
