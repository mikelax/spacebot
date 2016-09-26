'use strict';

const Bluebird = require('bluebird');
const OAuthError = require('../lib/errors').OAuthError;
const request = require('request-promise');

const InvalidTokenError = require('./errors').InvalidTokenError;

const verifyToken = requestToken => Bluebird.try(() => {
  const TOKEN = process.env.SLACK_TOKEN || 'token';

  if (TOKEN !== requestToken) {
    console.error(`The request token of ${requestToken} does not match slackbot token`);
    throw new InvalidTokenError(`The request token of ${requestToken} does not match slackbot token`);
  }
});

/**
 * Exchange OAuth token for access token
 * @param {Object} event - The Lambda event
 * @param {string} event.code - The Token to exchange
 * @param {string} [event.error] - An error from the OAuth process
 * @param {string} [event.state] - String passed through from initial OAuth request
 */
const exchangeCodeForToken = event =>
  Bluebird.try(() => {
    if (event.error) {
      throw new OAuthError('OAuth Request rejected by user');
    }
  })
  .then(() => request({
    uri: 'https://slack.com/api/oauth.access',
    method: 'POST',
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: event.code
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

const getHelpResponse = () => {
  const response = {
    response_type: 'ephemeral',
    attachments: [
      {
        fallback: 'Spacebot helps you find interesting images from NASA. There are several commands to interact with',
        pretext: 'Welcome to the spacebot Slack Bot. spacebot helps you find interesting images from NASA',
        text: `There are several commands you can use to find images from various NASA APIs\n
          /spacebot help - Displays this help message\n
          /spacebot apod - Display today's Astronomy Picture of the Day\n
          /spacebot apod random - Display a random 'Astronomy Picture of the Day'\n
          /spacebot apod date - Display the 'Astronomy Picture of the Day' for the given date. Format is YYYY-MM-DD\n
          /spacebot rovers help - Display help for commands on Mars rovers, cameras, and other data\n
          `,
        color: '#0B3D91'
      }
    ]
  };

  return response;
};

module.exports = {
  exchangeCodeForToken,
  getHelpResponse,
  verifyToken
};
