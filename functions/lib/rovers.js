'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const moment = require('moment');
const NoPhotosError = require('./errors').NoPhotosError;
const request = require('request-promise');

const ROVERS = {
  Curiosity: {
    name: 'Curiosity',
    description: '',
    launchDate: '2011-11-26',
    solOffset: 49268
  },
  Opportunity: {
    name: 'Opportunity',
    description: '',
    launchDate: '2003-07-07',
    solOffset: 46235
  },
  Spirit: {
    name: 'Spirit',
    description: '',
    launchDate: '2003-06-10',
    solOffset: 46214
  }
};

const CAMERAS = {
  FHAZ: {
    code: 'FHAZ',
    description: 'Front Hazard Avoidance Camera',
    rovers: [ROVERS.Curiosity, ROVERS.Opportunity, ROVERS.Spirit]
  },
  RHAZ: {
    code: 'RHAZ',
    description: 'Rear Hazard Avoidance Camera',
    rovers: [ROVERS.Curiosity, ROVERS.Opportunity, ROVERS.Spirit]
  },
  MAST: {
    code: 'MAST',
    description: 'Mast Camera',
    rovers: [ROVERS.Curiosity]
  },
  CHEMCAM: {
    code: 'CHEMCAM',
    description: 'Chemistry and Camera Complex',
    rovers: [ROVERS.Curiosity]
  },
  MAHLI: {
    code: 'MAHLI',
    description: 'Mars Hand Lens Imager',
    rovers: [ROVERS.Curiosity]
  },
  MARDI: {
    code: 'MARDI',
    description: 'Mars Descent Imager',
    rovers: [ROVERS.Curiosity]
  },
  NAVCAM: {
    code: 'NAVCAM',
    description: 'Navigation Camera',
    rovers: [ROVERS.Curiosity, ROVERS.Opportunity, ROVERS.Spirit]
  },
  PANCAM: {
    code: 'PANCAM',
    description: 'Panoramic Camera',
    rovers: [ROVERS.Opportunity, ROVERS.Spirit]
  },
  MINITES: {
    code: 'MINITES',
    description: 'Miniature Thermal Emission Spectrometer (Mini-TES)',
    rovers: [ROVERS.Opportunity, ROVERS.Spirit]
  }
};

/**
 * Convert an earth date to Sol number. Sol number is unique to each rover
 * @param {string} roverName - The name of the rover
 * @param {string} dateOrSol - A string date in either earth or Sol format
 * @return {number} - The Sol number for the given rover
 */
const convertDatetoSol = (roverName, dateOrSol) => {
  const rover = _.find(ROVERS, (o) =>
    _.lowerCase(o.name) === _.lowerCase(roverName)
  );
  let sol;

  if (_.toInteger(dateOrSol) === 0 && dateOrSol !== '0') {
    // param is a date, convert to Sol for given rover

    // Some formulas borrowed from:
    // https://github.com/jtauber/mars-clock
    // https://en.wikipedia.org/wiki/Timekeeping_on_Mars#Sols
    const start = moment(dateOrSol);
    const jdut = 2440587.5 + (start / 86400000);
    const jdtt = jdut + (35 + 32.184) / 86400; // eslint-disable-line no-mixed-operators
    const j2000 = jdtt - 2451545.0;
    const msd = (((j2000 - 4.5) / 1.027491252) + 44796.0 - 0.00096); // eslint-disable-line no-mixed-operators

    if (rover.name === ROVERS.Curiosity.name) {
      sol = _.floor(msd - (360 - 137.4) / 360) - rover.solOffset; // eslint-disable-line no-mixed-operators
    } else {
      sol = _.floor(msd - rover.solOffset - 0.042431);
    }
  } else {
    // param is already a Sol, just return
    sol = _.toInteger(dateOrSol);
  }

  // TODO determine if Sol is above max sol for rover and throw error
  return sol;
};

/**
 * Make an API call to NASA to get Mars rover photos
 * @param {string} rover - The name of the rover
 * @param {string} camera - The name of the camera.
 *    Can accept a value of 'all' to not filter by camera
 * @param {number} sol - The Sol date to get images from
 */
const getMarsRoverPhotos = (rover, camera, sol) => {
  const qs = {
    api_key: process.env.NASA_API_KEY,
    sol: sol,
    page: 1
  };

  // TODO change this logic to only add qs.camera if value matches name from CAMERAS object
  if (_.lowerCase(camera) !== _.lowerCase('all')) {
    qs.camera = camera;
  }

  return request({
    uri: `https://api.nasa.gov/mars-photos/api/v1/rovers/${_.lowerCase(rover)}/photos`,
    qs: qs,
    json: true
  })
  .then(photos => {
    console.log('Mars Photos in getMarsRoverPhotos function is', photos);
    return photos;
  })
  .catch((err) => {
    // check for 400 response and errors of: No Photos Found, throw specific error
    if (err.statusCode === 400 && err.error.errors === 'No Photos Found') {
      console.log('Received 400 error in getMarsRoverPhotos function');
      throw new NoPhotosError('OAuth ok response is false');
    }
    console.log('Error requesting NASA Mars Photos with qs', err, err.stack);
    throw err;
  });
};

const getRoverCameraHelp = () => {
  const resp = {
    response_type: 'ephemeral',
    mrkdwn: ['text'],
    text: 'You may use a value of _all_ to get images from all of the available cameras',
    attachments: []
  };

  // iterate over cameras object
  _.forEach(CAMERAS, (value) => {
    const camera = {};
    camera.fallback = `${value.code} - ${value.description}.`;
    let desc = `${value.code} - ${value.description}.\n  Avaiable on: `;
    desc += _.map(value.rovers, 'name').join(', ');

    camera.text = desc;
    resp.attachments.push(camera);
  });
  return resp;
};

const getRoversHelp = () => {
  /* eslint-disable max-len */
  const resp = {
    response_type: 'ephemeral',
    attachments: [
      {
        fallback: 'The rovers sub-command returns data and images from Mars rovers',
        pretext: `The rovers sub-command returns data and images from the three recent Mars rovers.
         If a rover name is omitted then _Curiosity_ will be used as the default.
         The date can be listed as either an earth date in the format _YYYY-MM-DD_ or _Sol_ number for the given rover.
         *Please Note* there may be no photos for a given date / _Sol_ because none were captured or they have not yet become public`,
        text: `/spacebot rovers help - Display this command\n
        /spacebot rovers info - Display information about the three rovers with links for even more information.\n
        /spacebot rovers cameras list - Display the list of onboard cameras. Theses can be used to filter the images. You can also use a value of 'all' to get images from all cameras.\n
        /spacebot rovers photos name camera date - Display a list of images from the given rover. One or more parameters can be left off starting from date, camera, then rover.`,
        mrkdwn_in: ['text', 'pretext']
      }
    ]
  };
  /* eslint-enable max-len */

  return resp;
};

const getRoversInfoHelp = () => {
  const curiositySol = convertDatetoSol(ROVERS.Curiosity.name);
  const opportunitySol = convertDatetoSol(ROVERS.Opportunity.name);

  /* eslint-disable max-len */
  const resp = {
    response_type: 'ephemeral',
    attachments: [
      {
        fallback: 'Curiosity - Mars Exploration Rover',
        title: 'Curiosity - Mars Exploration Rover',
        title_link: 'http://mars.nasa.gov/msl/mission/overview/',
        text: 'The "Curiosity" Mars Exploration Rover (MER) is the most recent rover sent to explore Mars. Curiosity was designed to assess whether Mars ever had an environment able to support small life forms called microbes.', // eslint-disable-line
        color: '#0B3D91',
        fields: [
          {
            title: 'Launch Date',
            value: 'Nov. 26, 2011 15:02 UTC',
            short: true
          },
          {
            title: 'Landing Date',
            value: 'Aug. 6, 2012 05:17 UTC',
            short: true
          },
          {
            title: 'Mission Sol Date',
            value: curiositySol,
            short: true
          },
          {
            title: 'Mission Status',
            value: 'Active',
            short: true
          },
          {
            title: 'Destination',
            value: 'Gale Crater, Mars',
            short: true
          }
        ]
      },
      {
        fallback: 'Opportunity - Mars Exploration Rover',
        title: 'Opportunity - Mars Exploration Rover',
        title_link: 'http://www.jpl.nasa.gov/missions/details.php?id=5909',
        text: 'The "Opportunity" Mars Exploration Rover (MER) was the second of two rovers launched in 2003 to explore Mars. Opportunity was launched on July 7, 2003 and landed on Mars on January 25, 2004.\nThe original mission plan was 90 days, but Opportunity is still active and returning data to NASA.', // eslint-disable-line
        color: '#0B3D91',
        fields: [
          {
            title: 'Launch Date',
            value: 'July 07, 2003 03:18 UTC',
            short: true
          },
          {
            title: 'Landing Date',
            value: 'January 25, 2004 04:54 UTC',
            short: true
          },
          {
            title: 'Mission Sol Date',
            value: opportunitySol,
            short: true
          },
          {
            title: 'Mission Status',
            value: 'Active',
            short: true
          },
          {
            title: 'Destination',
            value: 'Terra Meridiani, Mars',
            short: true
          }
        ]
      },
      {
        fallback: 'Spirit - Mars Exploration Rover',
        title: 'Spirit - Mars Exploration Rover',
        title_link: 'http://www.jpl.nasa.gov/missions/details.php?id=5917',
        text: 'The "Spirit" Mars Exploration Rover (MER) was launched in 2003 to explore the surface of Mars. Spirit was launched on June 10, 2003 and landed on Mars on January 4, 2004.\nThe original mission plan was 90 days, but Spirit far outlasted that.\nNASA ended the mission on May 25, 2011 after the rover became embedded in soft soil.', // eslint-disable-line
        color: '#0B3D91',
        fields: [
          {
            title: 'Launch Date',
            value: 'June 10, 2003 17:58 UTC',
            short: true
          },
          {
            title: 'Landing Date',
            value: 'January 04, 2004 04:35 UTC',
            short: true
          },
          {
            title: 'Final Mission Sol Date',
            value: 2627,
            short: true
          },
          {
            title: 'Mission Status',
            value: 'Retired',
            short: true
          },
          {
            title: 'Destination',
            value: 'Gusev Crater, Mars',
            short: true
          }
        ]
      }
    ]
  };
  /* eslint-enable max-len */

  return resp;
};

const getMarsRoversResponse = (params) => Bluebird.try(() => {
  // try to parse parameters
  let command;
  if (_.size(params) > 0) {
    if (_.lowerCase(params[0]) === 'help') {
      command = getRoversHelp();
    } else if (_.lowerCase(params[0]) === 'info') {
      command = getRoversInfoHelp();
    } else if (_.lowerCase(params[0]) === 'cameras' && _.lowerCase(params[1]) === 'list') {
      command = getRoverCameraHelp();
    } else if (_.lowerCase(params[0]) === 'photos') {
      const roverName = params[1] || ROVERS.Curiosity.name;
      const cameraName = params[2] || 'all';
      // API appears to lag by about two days with pictures that are available
      const date = params[3] || moment().subtract(2, 'days').format('YYYY-MM-DD');
      const sol = convertDatetoSol(roverName, date);

      command = getMarsRoverPhotos(roverName, cameraName, sol)
        .then(photos => {
          const resp = { response_type: 'in_channel', attachments: [] };

          const subset = _.chain(photos.photos)
            .sampleSize(7)
            .value();
          _.each(subset, photo => {
            const item = {
              text: `${photo.camera.name} - ${photo.camera.full_name}.\n${photo.earth_date} / Sol ${photo.sol}`,
              image_url: photo.img_src,
              color: '#0B3D91'
            };
            resp.attachments.push(item);
          });
          return resp;
        })
        .catch(NoPhotosError, () => (
          {
            response_type: 'ephemeral',
            text: `There are no photos available from ${roverName} with the given parameters. Try specifying a different camera or date. Also ensure the camera is available on the given rover. Use the \`rovers cameras list\` command to double check.\nCommand entered: \`${_.map(params).join(' ')}\``,  // eslint-disable-line max-len
            mrkdwn: ['text']
          }
        ))
        .catch(err => {
          console.log('Error parsing response from getMarsRoverPhotos', err, err.stack);
          return {
            response_type: 'ephemeral',
            text: `There was an error with your last request, please adjust the parameters and try again. The most likely cause is a typo in the Rover Name. Also ensure the camera name is available on the rover, and the date or Sol number is valid for the given rover.\nCommand entered: \`${_.map(params).join(' ')}\``, // eslint-disable-line max-len
            mrkdwn: ['text']
          };
        });
    } else {
      command = getRoversHelp();
    }
  } else {
    command = getRoversHelp();
  }

  return Bluebird
    .resolve(command);
});

module.exports = {
  getMarsRoversResponse
};
