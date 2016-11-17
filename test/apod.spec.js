'use strict';

const chai = require('chai');
const nasa = require('../functions/lib/nasa');
const should = require('chai').should();

describe('APOD', () => {
  // use sinon to stub API response
  describe('getAPODResponse', () => {
    it('should return the APOD with no params');
    it('should return the APOD with a specific date');
    it('should return the APOD with a param of random');
    it('should return the APOD with a video response'); // 2016-09-26 for example
    it('should return an error for a date before start of APOD');  // ex. 1992-04-24
  });
});
