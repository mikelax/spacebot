'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const moment = require('moment');
const qs = require('qs');
const slack = require('../lib/slack');

const favoritesTable = `${process.env.SERVERLESS_PROJECT}-favorites-${process.env.SERVERLESS_STAGE}`;
AWS.config.region = process.env.SERVERLESS_REGION; // HACK as aws-sdk doesn't read in region automatically :(
// Check if environment supports native promises
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));  // eslint-disable-line global-require
}

const dynamodb = new AWS.DynamoDB.DocumentClient();

const saveFavorite = (userId, service, mediaId, messagePayload) => {
  // TODO add 4th optionalParams obj. then check for values present in it
  // and add additional attributes to the params.Item object before calling putItem
  const params = {
    TableName: favoritesTable,
    Item: {
      slackUserId: userId,
      mediaId: _.toInteger(mediaId),
      service: service,
      team: messagePayload.team,
      channel: messagePayload.channel,
      user: messagePayload.user,
      createdAt: `${moment().unix()}`
    }
  };

  return dynamodb.put(params).promise();
};

module.exports.handler = function messages(event, context, cb) {
  const fullPayload = qs.parse(event.body);
  const messagePayload = JSON.parse(fullPayload.payload);
  console.log('The messagePayload is', messagePayload);

  slack.verifyToken(messagePayload.token)
  .then(() =>
    saveFavorite(messagePayload.user.id, messagePayload.callback_id, _.head(messagePayload.actions).value, messagePayload)
  )
  .then((resp) => {
    console.log('The response after saveFavorite call is', resp);
    const slackResponse = {
      response_type: 'ephemeral',
      text: 'Saved! You will be able to browse your favorites soon.',
      replace_original: false
    };

    cb(null, slackResponse);
  })
  .catch((err) => {
    console.log('ERROR saving favorite', err);
    const slackResponse = {
      response_type: 'ephemeral',
      text: 'Error! There was an error saving your favorite. Please try again or contact support.',
      replace_original: false
    };
    cb(slackResponse);
  });
};
