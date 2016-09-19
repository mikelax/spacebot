'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const qs = require('qs');

AWS.config.region = process.env.SERVERLESS_REGION; // HACK as aws-sdk doesn't read in region automatically :(
// Check if environment supports native promises
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));  // eslint-disable-line global-require
}

const sns = new AWS.SNS();

module.exports.handler = function contact(event, context, cb) {
  const contactBody = qs.parse(event.body);
  console.log(contactBody);
  if (_.isEmpty(contactBody)) {
    const err = new Error('Empty form submitted');
    err.status = 400;
    cb(err);
  }

  const params = {
    TopicArn: process.env.SNS_CONTACTFORM_TOPIC,
    Message: JSON.stringify(contactBody),
    Subject: 'Contact Form Submission'
  };

  sns.publish(params).promise()
  .then(() => {
    cb(null, '');
  })
  .catch(err => {
    console.log('Error submitting contact form', err, err.stack);
    err.status = 400;
    cb(JSON.stringify(err));
  });
};
