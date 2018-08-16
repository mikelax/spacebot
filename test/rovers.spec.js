const chai = require('chai');
const nasa = require('../functions/lib/nasa');
const rovers = require('../functions/lib/rovers');
const should = require('chai').should();

chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const verifyHelp = respPromise =>
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
      it('should display rovers info with info parameter (rovers info)', () => {
        const respPromise = rovers.getMarsRoversResponse(['info']);
        return respPromise
          .should.be.fulfilled
          .then((response) => {
            response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
            response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(3);
            response.attachments.should.all.have.property('fallback');
            response.attachments.should.all.have.property('title');
            response.attachments.should.all.have.property('title_link');
            response.attachments.should.all.have.a.property('text');
            response.attachments.should.all.have.property('color');
            response.attachments.should.all.have.property('fields');
          });
      });
      it('should display rovers cameras list with list parameter (cameras list)', () => {
        const respPromise = rovers.getMarsRoversResponse(['cameras', 'list']);
        return respPromise
          .should.be.fulfilled
          .then((response) => {
            response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
            response.should.have.a.property('mrkdwn').that.is.an('array').with.lengthOf(1);
            response.should.have.a.property('text').that.is.a('string');
            response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(9);
            response.attachments.should.all.have.property('fallback');
            response.attachments.should.all.have.property('text');
          });
      });
    });

    describe('photos command', () => {
      it('should return the no photos error for invalid rover / camera combo');
      it('should return the no photos error for invalid camera name');
      it('should return the no photos error for invalid rover / Sol combo');
      it('should return the general error for invalid rover name');
      it('should return photos for Curiosity with no parameters specified');
      it('should return photos with just rover specified');
      it('should return photos with rover and camera specified');
      it('should return photos with rover, camera, and date specified');
      it('should return photos with rover, camera, and Sol specified');
      it('should return photos for Curiosity with just camera and date specified');
      it('should return photos for Curiosity with just camera specified');
      it('should return photos for Curiosity with just date specified');
    });
  });
});
