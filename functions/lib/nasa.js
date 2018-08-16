const _ = require('lodash');
const Bluebird = require('bluebird');
const InvalidDateError = require('./errors').InvalidDateError;
const moment = require('moment');
const request = require('request-promise');

const getAPOD = date =>
  request({
    uri: 'https://api.nasa.gov/planetary/apod',
    qs: {
      api_key: process.env.NASA_API_KEY,
      date: moment(date).format('YYYY-MM-DD'),
      hd: true
    },
    json: true
  })
  .catch((err) => {
    console.log('Error requesting NASA APOD with qs', err, err.stack);
    throw err;
  })
  .then((apod) => {
    console.log('APOD in getAPOD function is', apod);
    return apod;
  });

/**
 * Generate a URL for the APOD page for a specific date
 * @param {string} The date in YYYY-MM-DD format
 * @return {string} The APOD Page URL
 */
const getAPODPageUrl = (date) => {
  const year = date.substring(2, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  return `http://apod.nasa.gov/apod/ap${year}${month}${day}.html`;
};

const getAPODResponse = params => Bluebird.try(() => {
  // Assign a default date of today to serve as default
  let date = moment();
  // Account for lambda running in UTC but nasa APIs in ET (prevents end of day calls to next day)
  date = date.utcOffset(-4);

  if (_.size(params) > 0) {
    if (_.lowerCase(params[0]) === 'random') {
      // Generate random date here
      date = moment().subtract(Math.floor((Math.random() * 7300) + 1), 'days');
    } else if (moment(params[0]).isValid()) {
      date = moment(params[0]);
    }
  }

  console.log(`The APODResponse date is ${date.format('YYYY-MM-DD')}`);

  // Check that our date value is supported by APOD API
  if (moment('1995-06-16').isAfter(date)) {
    throw new InvalidDateError('Date must be between June 16, 1995 and today');
  }

  return getAPOD(date)
  .then((apod) => {
    const apodPageUrl = getAPODPageUrl(apod.date);
    const resp = {
      response_type: 'in_channel',
      attachments: [
        {
          fallback: `${apod.title} - ${apodPageUrl}`,
          title: apod.title,
          title_link: apodPageUrl,
          text: apod.explanation,
          footer: `APOD ${apod.date}`,
          color: '#0B3D91',
          callback_id: 'apod',
          actions: [
            {
              name: 'favorite',
              text: 'Save as Favorite',
              type: 'button',
              value: `${date.format('YYYYMMDD')}`
            }
          ]
        }
      ]
    };

    // Add the image vs. video specific attributes
    if (apod.media_type === 'image') {
      resp.attachments[0].image_url = apod.url;
      resp.attachments.push({
        title: 'Open the HD Image',
        title_link: apod.hdurl,
        color: '#FC3D21'
      });
    } else if (apod.media_type === 'video') {
      // hack to get Slack to unfurl youtube link as it doesn't handle youtube.com/embed/:id links
      resp.text = _.replace(apod.url, 'youtube.com/embed/', 'youtube.com/watch?v=')
        .replace('?rel=0', '');
    }

    return resp;
  });
});

module.exports = {
  getAPODResponse
};
