'use strict';

const Bluebird = require('bluebird');

const InvalidTokenError = require('./errors').InvalidTokenError;

const verifyToken = (requestToken) => Bluebird.try(() => {
  const TOKEN = process.env.SLACK_TOKEN || 'token';

  if (TOKEN !== requestToken) {
    console.error(`The request token of ${requestToken} does not match slackbot token`);
    throw new InvalidTokenError(`The request token of ${requestToken} does not match slackbot token`);
  }
});

const getHelpResponse = () => {
  const response = {
    response_type: 'ephemeral',
    attachments: [
      {
        pretext: 'Welcome to the spacebot Slack Bot. spacebot helps you find interesting images from NASA',
        text: `There are several commands you can use to find images from various NASA APIs\n
            /spaecbot help - Displays this help message\n
            /spacebot apod - Display today's <http://apod.nasa.gov/apod/astropix.html|Astronomy Picture of the Day>\n
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
  verifyToken,
  getHelpResponse
};
