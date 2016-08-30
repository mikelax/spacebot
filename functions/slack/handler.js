'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const qs = require('qs');
const errorToJsonAndLog = require('../lib/errors').errorToJsonAndLog;
const slack = require('../lib/slack');
const nasa = require('../lib/nasa');

const COMMANDS = {
  help: slack.getHelpResponse,
  apod: nasa.getAPODResponse
};

module.exports.slash = function slash(event, context, cb) {
  const slackPayload = qs.parse(event.body);
  console.log(slackPayload);

  slack.verifyToken(slackPayload.token)

  // .then(() => Bluebird.try(() => {
  .then(() => {
    const slackText = _.isString(slackPayload.text)
      && !_.isUndefined(slackPayload.text)
      ? slackPayload.text.trim() : 'help';
    const input = _.words(slackText, /[^, ]+/g);
    const command = _.has(COMMANDS, input[0])
      ? input[0] : 'help';
    const params = _.tail(input);
    return { command: command, params: params };
  // }))
  })
  .then((command) => Bluebird.try(() =>
    // TODO send command.params as param
    COMMANDS[command.command](command.params)
  ))
  .then(resp => {
    console.log('Inside final then with resp', resp);
    cb(null, resp);
  })

  // .then(() => nasa.getAPOD())
  // .then(apod => {
  //   const apodPageUrl = nasa.getAPODPageUrl(apod.date);
  //   const resp = {
  //     response_type: 'in_channel',
  //     attachments: [
  //       {
  //         fallback: `${apod.title} - ${apodPageUrl}`,
  //         title: apod.title,
  //         title_link: apodPageUrl,
  //         image_url: apod.url,
  //         text: apod.explanation,
  //         footer: `APOD ${apod.date}`,
  //         color: '#0B3D91'
  //       },
  //       {
  //         title: 'Open the HD Image',
  //         title_link: apod.hdurl,
  //         color: '#FC3D21'
  //       }
  //     ]
  //   };
  //   cb(null, resp);
  // })
  .catch(e => cb(errorToJsonAndLog(e)));
};
