'use strict';

const chai = require('chai');
const InvalidTokenError = require('../functions/lib/errors').InvalidTokenError;
const should = require('chai').should();
const slack = require('../functions/lib/slack');

chai.use(require('chai-as-promised'));

describe('Slack Lib', () => {
  describe('verifyToken', () => {
    it('doesn\'t throw an error for correct token', () =>
      slack.verifyToken('token').should.be.fulfilled
    );

    it('throws an error for an invalid token', () =>
      slack.verifyToken('foo').should.be.rejectedWith(InvalidTokenError)
    );
  });

  describe('exchangeCodeForToken', () => {
    it('Should return an access token with valid code');
  });

  describe('getHelpResponse', () => {
    it('Should return slack-formatted help response', () => {
      const response = slack.getHelpResponse();
      response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
      response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);
      response.should.have.a.deep.property('attachments[0].pretext').that.matches(/^Welcome to the spacebot Slack Bot/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/Displays this help message/);
      response.should.have.a.deep.property('attachments[0].color', '#0B3D91');
    });
  });
});
