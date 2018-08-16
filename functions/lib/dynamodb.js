const _ = require('lodash');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
const moment = require('moment');

const oauthTokensTable = `${process.env.SERVERLESS_PROJECT}-oauthtokens-${process.env.SERVERLESS_STAGE}`;
AWS.config.region = process.env.SERVERLESS_REGION; // HACK as aws-sdk doesn't read in region automatically :(
// Check if environment supports native promises
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));  // eslint-disable-line global-require
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
    TableName: oauthTokensTable,
    Item: {
      slackUserId: userId,
      teamId: teamId,
      accessToken: accessToken,
      scope: _.split(scope, ','),
      teamName: teamName,
      updatedAt: `${moment().unix()}`
    }
  };

  return dynamodb.put(params).promise();
};

module.exports = {
  saveOAuthToken
};
