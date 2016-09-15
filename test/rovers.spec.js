'use strict';

const chai = require('chai');
const nasa = require('../functions/lib/nasa');
const rovers = require('../functions/lib/rovers');
const should = require('chai').should();

chai.use(require('chai-as-promised'));

const verifyHelp = (respPromise) =>
  respPromise
  .should.be.fulfilled
  .then((response) => {
    response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
    response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);

    response.should.have.a.deep.property('attachments[0].fallback')
      .that.matches(/^The rovers sub-command returns data and images from Mars rovers/);
    response.should.have.a.deep.property('attachments[0].pretext')
      .that.matches(/If a rover name is omitted then _Curiosity_/);
    response.should.have.a.deep.property('attachments[0].text')
      .that.matches(/\/spacebot rovers help - Display this command/);
    response.should.have.a.deep.property('attachments[0].mrkdwn_in')
      .that.is.an('array').with.lengthOf(2)
      .that.equals(['text', 'pretext']);
  });

describe('Rovers sub-command', () => {
  describe('getMarsRoversResponse', () => {
    describe('help and info commands', () => {
      it('should display help with the help parameter (rovers help)', () => {
        const respPromise = rovers.getMarsRoversResponse(['help']);
        return verifyHelp(respPromise);
      });
      it('should display help with the help parameter (rovers foo)', () => {
        const respPromise = rovers.getMarsRoversResponse(['foo']);
        return verifyHelp(respPromise);
      });
      it('should display rovers info with info parameter (rovers info)');
      it('should display rovers cameras list with list parameter (cameras list)');
    });
  });
});
