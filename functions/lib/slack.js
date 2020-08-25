const _ = require('lodash');
const Bluebird = require('bluebird');
const request = require('request-promise');
const { EmptyEventError } = require('./errors');
const { InvalidTokenError } = require('./errors');
const nasa = require('./nasa');
const { OAuthError } = require('./errors');
const rovers = require('./rovers');

/**
 * Get general help usage for bot
 * @param {Array} params - First element should be the platform the command originated from
 */
const getHelpResponse = (params) => {
  const prefix = _.size(params) > 0 && params[0] === 'teams' ? '@' : '/';
  // const prefix = platform === 'teams' ? '@' : '/';
  const text = [];
  text.push('There are several commands you can use to find images from various NASA APIs');
  text.push(`${prefix}spacebot help - Displays this help message`);
  text.push(`${prefix}spacebot apod - Display today's Astronomy Picture of the Day`);
  text.push(`${prefix}spacebot apod random - Display a random 'Astronomy Picture of the Day`);
  text.push(`${prefix}spacebot apod date - Display the 'Astronomy Picture of the Day' for the given date. Format is YYYY-MM-DD`); // eslint-disable-line
  text.push(`${prefix}spacebot rovers help - Display help for commands on Mars rovers, photos and more`);

  const response = {
    response_type: 'ephemeral',
    attachments: [
      {
        fallback: 'Spacebot helps you find interesting images from NASA. There are several commands to interact with',
        pretext: 'Welcome to the spacebot Bot. spacebot helps you find interesting images from NASA',
        text: _.join(text, '\n'),
        color: '#0B3D91'
      }
    ]
  };

  return response;
};

const COMMANDS = {
  help: getHelpResponse,
  apod: nasa.getAPODResponse,
  rovers: rovers.getMarsRoversResponse
};

/**
 * Extract the platform the command originated from
 * @param {Object} payload - THe payload for the command
 * @return {string} The name of the platform
 */
const extractPlatform = (payload) => (payload.channel_name && payload.team_domain ? 'slack' : 'teams');

/**
 * Verify the token received from request matches token registered with slack app
 * @param {string} requestToken - The token extracted from the request
 */
const verifyToken = (requestToken) => Bluebird.try(() => {
  const TOKEN = process.env.SLACK_TOKEN || 'token';

  if (TOKEN !== requestToken) {
    console.error(`The request token of ${requestToken} does not match slackbot token`);
    throw new InvalidTokenError(`The request token of ${requestToken} does not match slackbot token`);
  }
});

/**
 * Checks for an empty body or a body with ssl_check=1. These will be used by cron keep alive
 * and potential ssl status checks from slack
 * @param {Object} payload - Object representation of slack request body
 */
const verifyKeepAliveOrSSLCheck = (payload) => {
  if (_.isEmpty(payload) || payload.ssl_check === '1') {
    throw new EmptyEventError('SSL Check or emtpy event request');
  }
};

/**
 * Extract the sub-command to be run from the given payload received from slack
 * @param {Object} payload - The key value mapping of the request body sent by slack slash command
 * @return {Object} command - An Object with two attributes: `command` and `params`
 */
const extractSubCommand = (payload) => {
  const slackText = _.isString(payload.text) && !_.isUndefined(payload.text)
    ? payload.text.trim() : 'help';
  const input = _(slackText).words(/[^, ]+/g).without('<at>spacebot</at>', '@spacebot').value();
  const command = _.has(COMMANDS, input[0]) ? input[0] : 'help';
  const params = command === 'help' ? [extractPlatform(payload)] : _.tail(input);

  // const platform = extractPlatform(payload);

  return { command, params };
};

/**
 * Exchange OAuth token for access token
 * @param {Object} event - The Lambda event
 * @param {string} [event.queryStringParameters.code] - The Token to exchange
 * @param {string} [event.queryStringParameters.error] - An error from the OAuth process
 * @param {string} [event.queryStringParameters.state] - String passed through from initial OAuth request
 */
const exchangeCodeForToken = (event) => Bluebird.try(() => {
  if (event.queryStringParameters.error) {
    throw new OAuthError('OAuth Request rejected by user');
  }
})
  .then(() => request({
    uri: `${process.env.SLACK_API_URL}oauth.access`,
    method: 'POST',
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: event.queryStringParameters.code
    },
    json: true
  }))
  .then((resp) => {
    console.log('Response from Slack oauth.access', resp);
    if (resp.ok === false) {
      throw new OAuthError('OAuth ok response is false');
    }
    return resp;
  })
  .catch((err) => {
    console.log('Error exchanging OAuth Code for Access Token', err, err.stack);
    throw err;
  });

module.exports = {
  COMMANDS,
  exchangeCodeForToken,
  extractSubCommand,
  extractPlatform,
  getHelpResponse,
  verifyKeepAliveOrSSLCheck,
  verifyToken
};
