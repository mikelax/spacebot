const _ = require('lodash');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
const moment = require('moment');

// Check if environment supports native promises
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird')); // eslint-disable-line global-require
}

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Save or update an OAuth token for a user
 * @param {string} userId The user id
 * @param {string} teamId The team id
 * @param {string} accessToken The user access token
 * @param {string} scope Comma separated list of granted scopes
 * @param {string} teamName The display team name
 */
const saveOAuthToken = (userId, teamId, accessToken, scope, teamName) => {
  const params = {
    TableName: process.env.TOKENS_TABLE_NAME,
    Item: {
      slackUserId: userId,
      teamId,
      accessToken,
      scope: _.split(scope, ','),
      teamName,
      updatedAt: `${moment().unix()}`
    }
  };

  return dynamodb.put(params).promise();
};

module.exports = {
  saveOAuthToken
};
