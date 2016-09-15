'use strict';

const _ = require('lodash');
const moment = require('moment');

const ROVERS = {
  Curiosity: {
    name: 'Curiosity',
    description: '',
    launchDate: '2011-11-26',
    firstSolDate: '2012-08-07'
  },
  Opportunity: {
    name: 'Opportunity',
    description: '',
    launchDate: '2003-07-07',
    firstSolDate: '2004-01-26'
  },
  Spirit: {
    name: 'Spirit',
    description: '',
    launchDate: '2003-06-10',
    firstSolDate: '2004-01-05'
  }
};

// const params = ['photos', 'spirit', 'MAST'];
const params = ['photos'];

// const roverName = params[1] || 'curiosity';
// console.log(roverName);

// const roverName = 'curiousity';
const roverName = params[1] || ROVERS.Curiosity.name;
// const param = '1000';
const param = '2016-09-08';
// const param = 'foo';

console.log(roverName);

if (_.toInteger(param) === 0 && param !== '0') {
  // not number assume date
  // const start = moment('2011-11-26');
  const rover = _.find(ROVERS, (o) =>
    _.lowerCase(o.name) === _.lowerCase(roverName)
  );
  console.log(rover);
  const start = moment(rover.firstSolDate);
  const date = moment(param);
  console.log(date.isBetween('2011-11-26', '2016-09-07'));
  console.log(date.fromNow());

  const sol = date.diff(start, 'days');
  console.log(sol);
  console.log('Corrected Sol number is', _.toInteger(sol / 1.02749125));
} else {
  console.log(_.toInteger(param));
}

// console.log(_.isNumber(_.toInteger(param)));
// console.log(_.isNumber(_.toInteger(param1)));
// console.log(_.toInteger(param1));
