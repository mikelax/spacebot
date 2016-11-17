'use strict';

const Bluebird = require('bluebird');
const EmptyEventError = require('../lib/errors').EmptyEventError;
const generateSlackErrorResponse = require('../lib/errors').generateSlackErrorResponse;
const qs = require('qs');
const slack = require('../lib/slack');

module.exports.slash = function slash(event, context, cb) {
  const slackPayload = qs.parse(event.body);
  console.log(slackPayload);

  Bluebird.try(() => slack.verifyKeepAliveOrSSLCheck(slackPayload))
    .then(() => slack.verifyToken(slackPayload.token))
    .then(() => slack.extractSubCommand(slackPayload))
    .then(command => Bluebird.try(() =>
      slack.COMMANDS[command.command](command.params)
    ))
    .then((resp) => {
      cb(null, resp);
    })
    .catch(EmptyEventError, () => {
      cb(null, 'ACK');
    })
    .catch(e => cb(null, generateSlackErrorResponse(e)));
};
