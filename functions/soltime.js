'use strict';

const _ = require('lodash');
const moment = require('moment');

const ROVERS = {
  Curiosity: {
    name: 'Curiosity',
    description: '',
    launchDate: '2011-11-26',
    solOffset: 46235
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

let sol;
const rover = ROVERS.Spirit;
const epoch = moment('2011-05-25');
// const start = moment(dateOrSol);
const jdut = 2440587.5 + (epoch / 86400000);
const jdtt = jdut + (35 + 32.184) / 86400; // eslint-disable-line no-mixed-operators
const j2000 = jdtt - 2451545.0;
const msd = (((j2000 - 4.5) / 1.027491252) + 44796.0 - 0.00096); // eslint-disable-line no-mixed-operators

if (ROVERS.Curiosity.name === 'Curiosity') {
  sol = _.floor(msd - (360 - 137.4) / 360) - rover.solOffset; // eslint-disable-line no-mixed-operators
} else {
  sol = _.floor(msd - rover.solOffset - 0.042431);
}

console.log(epoch.format('x'));
console.log(jdut);
console.log(jdtt);
console.log(j2000);
console.log(sol);
