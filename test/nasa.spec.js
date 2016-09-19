'use strict';

const chai = require('chai');
const nasa = require('../functions/lib/nasa');
const should = require('chai').should();

describe('NASA (APOD)', () => {
  describe('getAPODResponse', () => {
    it('should return the APOD with no params');
    it('should return the APOD with a specific date');
    it('should return the APOD with a param of random');
  });
});
