'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const request = require('request-promise');

const ROVERS = {
  Curiousity: {
    name: 'Curiousity',
    description: ''
  },
  Opportunity: {
    name: 'Opportunity',
    description: ''
  },
  Spirit: {
    name: 'Spirit',
    description: ''
  }
};

const CAMERAS = {
  FHAZ: {
    code: 'FHAZ',
    description: 'Front Hazard Avoidance Camera',
    rovers: [ROVERS.Curiousity, ROVERS.Opportunity, ROVERS.Spirit]
  },
  RHAZ: {
    code: 'RHAZ',
    description: 'Rear Hazard Avoidance Camera',
    rovers: [ROVERS.Curiousity, ROVERS.Opportunity, ROVERS.Spirit]
  },
  MAST: {
    code: 'MAST',
    description: 'Mast Camera',
    rovers: [ROVERS.Curiousity]
  },
  CHEMCAM: {
    code: 'CHEMCAM',
    description: 'Chemistry and Camera Complex',
    rovers: [ROVERS.Curiousity]
  },
  MAHLI: {
    code: 'MAHLI',
    description: 'Mars Hand Lens Imager',
    rovers: [ROVERS.Curiousity]
  },
  MARDI: {
    code: 'MARDI',
    description: 'Mars Descent Imager',
    rovers: [ROVERS.Curiousity]
  },
  NAVCAM: {
    code: 'NAVCAM',
    description: 'Navigation Camera',
    rovers: [ROVERS.Curiousity, ROVERS.Opportunity, ROVERS.Spirit]
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
 * @param {string} rover - The name of the rover
 * @param {Moment} date - A Moment earth date
 * @return {number} - The Sol number for the given rover
 */
const convertDatetoSol = (rover, date) => {
  // TODO implement
  return 1000;
};

const getMarsRoverPhotos = (rover, camera) =>
  request({
    uri: `https://api.nasa.gov/mars-photos/api/v1/rovers/${_.lowerCase(rover)}/photos`,
    qs: {
      api_key: process.env.NASA_API_KEY,
      camera: camera,
      sol: 1050,
      page: 1
    },
    json: true
  })
  .catch((err) => {
    console.log('Error requesting NASA Mars Photos with qs', err, err.stack);
    throw err;
  })
  .then(photos => {
    console.log('Mars Photos in getMarsRoverPhotos function is', photos);
    return photos;
  });

const getRoverCameraHelp = () => {
  let resp = {
    response_type: 'ephemeral',
    attachments: []
  };

  // iterate over cameras object
  _.forEach(CAMERAS, (value) => {
    let camera = {};
    let desc = `${value.code} - ${value.description}.\n  Avaiable on: `;
    desc += _.map(value.rovers,'name').join(', ');

    camera.text = desc;
    resp.attachments.push(camera);
  });
  return resp;
};

const getRoverHelp = () => {
  const resp = {
    response_type: 'ephemeral',
    attachments: [
      {
        pretext: `The rovers sub-command returns data and images from the three recent Mars rovers.
         If a rover name is ommitted then Curiosity will be used as the default.`,
        text: `/spacebot rovers help - Display this command\n
        /spacebot rovers cameras list - Display the list of onboard cameras. Theses can be used to filter the images\n
        /spacebot rovers photos name camera date - Display a list of images from the given rover`,
        fields: [
          {
            title: 'Curiosity',
            value: 'Active',
            short: true
          },
          {
            title: 'Opportunity',
            value: 'Active',
            short: true
          },
          {
            title: 'Spirit',
            value: 'Retired',
            short: true
          }
        ]
      },
      {
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
            title: 'Destination',
            value: 'Gusev Crater, Mars',
            short: true
          }
        ]
      },
      {
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
            title: 'Destination',
            value: 'Terra Meridiani, Mars',
            short: true
          }
        ]
      },
      {
        title: 'Curiosity - Mars Exploration Rover',
        title_link: 'http://mars.nasa.gov/msl/mission/overview/',
        text: 'The "Curiosity" Mars Exploration Rover (MER) is the most recent rover sent to explore Mars. Curiosity was designed to assess whether Mars ever had an environment able to support small life forms called microbes.', // eslint-disable-line
        color: '#0B3D91',
        fields: [
          {
            title: 'Launch Date',
            value: 'Nov. 26, 2011 10:02a.m. EST',
            short: true
          },
          {
            title: 'Landing Date',
            value: 'Aug. 6, 2012 1:32a.m. EDT',
            short: true
          },
          {
            title: 'Destination',
            value: 'Gale Crater, Mars',
            short: true
          }
        ]
      }
    ]
  };

  return resp;
};

const getMarsRoversResponse = (params) => Bluebird.try(() => {
  // try to parse parameters
  let resp;
  if (_.size(params) > 0) {
    if (_.lowerCase(params[0]) === 'help') {
      resp = getRoverHelp();
    } else if (_.lowerCase(params[0]) === 'cameras' && _.lowerCase(params[1]) === 'list') {
      resp = getRoverCameraHelp();
    } else if (_.lowerCase(params[0]) === 'photos') {
      // TODO check for other params
      getMarsRoverPhotos('curiosity', 'MAST')
        .then(photos => {
          resp = { response_type: 'in_channel', attachments: [] }
          _.forEach(photos, (photo) => {
            const camera = {
              text: `${photo.camera.name} - ${photo.camera.full_name}.\n${photo.earth_date} / Sol ${photo.sol}`,
              image_url: photo.img_src,
              color: '#0B3D91'
            }
            resp.attachments.push(camera);
          });
        })
        .catch(err => {
          resp = {
            response_type: 'ephemeral',
            text: 'There was an error with your last request, please adjust the parameters and try again'
          }
        });
    } else {
      resp = getRoverHelp();
    }
  } else {
    resp = getRoverHelp();
  }

  return resp;
});

module.exports = {
  getMarsRoversResponse
};
