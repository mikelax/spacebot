'use strict';

const Bluebird = require('bluebird');
const request = require('request-promise');

const InvalidTokenError = require('./errors').InvalidTokenError;

const verifyToken = (requestToken) => Bluebird.try(() => {
  const TOKEN = process.env.SLACK_TOKEN || 'token';

  if (TOKEN !== requestToken) {
    console.error(`The request token of ${requestToken} does not match slackbot token`);
    throw new InvalidTokenError(`The request token of ${requestToken} does not match slackbot token`);
  }
});

const exchangeCodeForToken = (code) =>
  request({
    uri: 'https://slack.com/api/oauth.access',
    method: 'POST',
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: code
    }
  })
  .then(resp => {
    console.log('Response from Slack oauth.access', resp);
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
        pretext: 'Welcome to the spacebot Slack Bot. spacebot helps you find interesting images from NASA',
        text: `There are several commands you can use to find images from various NASA APIs\n
            /spaecbot help - Displays this help message\n
            /spacebot apod - Display today's Astronomy Picture of the Day\n
            /spacebot apod random - Display a random 'Astronomy Picture of the Day'\n
            /spacebot apod date - Display the 'Astronomy Picture of the Day' for the given date. Format is YYYY-MM-DD\n
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
