const _ = require('lodash');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
const qs = require('qs');

// Check if environment supports native promises
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird')); // eslint-disable-line global-require
}

const sns = new AWS.SNS();

module.exports.handler = function contact(event, context, cb) {
  const contactBody = qs.parse(event.body);
  console.log(contactBody);
  if (_.isEmpty(contactBody)) {
    const err = new Error('Empty form submitted');
    err.status = 400;
    cb(null, err);
  }

  const params = {
    TopicArn: process.env.SNS_CONTACTFORM_TOPIC,
    Message: JSON.stringify(contactBody),
    Subject: 'Contact Form Submission'
  };

  sns.publish(params).promise()
    .then(() => {
      cb(null, {
        statusCode: 204,
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
      });
    })
    .catch((err) => {
      console.log('Error submitting contact form', err, err.stack);
      err.status = 400;
      cb({
        statusCode: 204,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(err)
      });
    });
};
