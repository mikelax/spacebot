'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const errorToJsonAndLog = require('../lib/errors').errorToJsonAndLog;
const nasa = require('../lib/nasa');
const qs = require('qs');
const rovers = require('../lib/rovers');
const slack = require('../lib/slack');

const COMMANDS = {
  help: slack.getHelpResponse,
  apod: nasa.getAPODResponse,
  rovers: rovers.getMarsRoversResponse
};

module.exports.slash = function slash(event, context, cb) {
  const slackPayload = qs.parse(event.body);
  console.log(slackPayload);

  slack.verifyToken(slackPayload.token)
  .then(() => {
    const slackText = _.isString(slackPayload.text)
      && !_.isUndefined(slackPayload.text)
      ? slackPayload.text.trim() : 'help';
    const input = _.words(slackText, /[^, ]+/g);
    const command = _.has(COMMANDS, input[0])
      ? input[0] : 'help';
    const params = _.tail(input);
    return { command: command, params: params };
  })
  .then((command) => Bluebird.try(() =>
    COMMANDS[command.command](command.params)
  ))
  .then(resp => {
    cb(null, resp);
  })
  .catch(e => cb(errorToJsonAndLog(e)));
};
