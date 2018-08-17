const Bluebird = require('bluebird');
const qs = require('qs');
const { EmptyEventError } = require('../lib/errors');
const { generateSlackErrorResponse } = require('../lib/errors');
const slack = require('../lib/slack');

module.exports.slash = function slash(event, context, cb) {
  const slackPayload = qs.parse(event.body);
  console.log(slackPayload);

  Bluebird.try(() => slack.verifyKeepAliveOrSSLCheck(slackPayload))
    .then(() => slack.verifyToken(slackPayload.token))
    .then(() => slack.extractSubCommand(slackPayload))
    .then(command => Bluebird.try(() => slack.COMMANDS[command.command](command.params)))
    .then((resp) => {
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resp)
      });
    })
    .catch(EmptyEventError, () => {
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'ACK'
      });
    })
    .catch(e => cb(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(generateSlackErrorResponse(e))
    }));
};
