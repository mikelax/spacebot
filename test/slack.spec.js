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

  describe('extractPlatform', () => {
    it('should extract slack', () => {
      const payload = {
        token: 'xxxxx',
        team_id: 'teamid',
        team_domain: 'the-team-name',
        channel_id: 'abcde',
        channel_name: 'somechannelname',
        user_id: 'userid',
        user_name: 'the user name',
        command: '/spacebot',
        text: 'apod',
        response_url: 'https://hooks.slack.com/commands/teamid/123456/abcdef'
      };
      const platform = slack.extractPlatform(payload);
      platform.should.equal('slack');
    });
    it('should extract teams', () => {
      const payload = {
        token: 'L0xQueWiCz2dRNY41d1O3hwy',
        channel_id: 'a:abdhGDJHDYGD',
        user_id: 'fda8b5d3bd6541467f7b4fb077bdd9ba983f925c:4418',
        user_name: 'the user name',
        command: '/spacebot',
        text: 'apod',
        channel_name: '',
        team_domain: '',
        response_url: 'https://slack66atPpePXcv-nZfipkIBgmX4LQ63.api.message.io/abcdefg'
      };
      const platform = slack.extractPlatform(payload);
      platform.should.equal('teams');
    });
  });

  describe('extractSubCommand', () => {
    it('should return help command for an invalid string', () => {
      const command = slack.extractSubCommand({ text: 'foo foo foo' });
      command.should.have.a.property('command').that.is.a('string').that.equals('help');
      command.should.have.a.property('params').that.is.an('array').with.lengthOf(1);
      command.params.should.eql(['teams']);
    });
    it('should return apod command for apod string', () => {
      const command = slack.extractSubCommand({ text: 'apod random' });
      command.should.have.a.property('command').that.is.a('string').that.equals('apod');
      command.should.have.a.property('params').that.is.an('array').with.lengthOf(1);
    });
    it('should return rovers command for rovers string', () => {
      const command = slack.extractSubCommand({ text: 'rovers photos' });
      command.should.have.a.property('command').that.is.a('string').that.equals('rovers');
      command.should.have.a.property('params').that.is.an('array').with.lengthOf(1);
    });
    it('should extract @mention and return rovers command for rovers string', () => {
      const command = slack.extractSubCommand({ text: '@spacebot rovers photos' });
      command.should.have.a.property('command').that.is.a('string').that.equals('rovers');
      command.should.have.a.property('params').that.is.an('array').with.lengthOf(1);
    });
    it('should extract <at>mention and return apod command', () => {
      const command = slack.extractSubCommand({ text: '<at>spacebot</at>   apod random' });
      command.should.have.a.property('command').that.is.a('string').that.equals('apod');
      command.should.have.a.property('params').that.is.an('array').with.lengthOf(1);
    });
  });

  describe('getHelpResponse', () => {
    it('Should return slack formatted help response with slack param', () => {
      const response = slack.getHelpResponse(['slack']);
      response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
      response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);
      response.should.have.a.deep.property('attachments[0].pretext').that.matches(/^Welcome to the spacebot Bot/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/Displays this help message/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/\/spacebot help - Displays this help message/); // eslint-disable-line
      response.should.have.a.deep.property('attachments[0].color', '#0B3D91');
    });
    it('Should return slack formatted help response with no param', () => {
      let response = slack.getHelpResponse();
      response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
      response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);
      response.should.have.a.deep.property('attachments[0].pretext').that.matches(/^Welcome to the spacebot Bot/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/Displays this help message/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/\/spacebot help - Displays this help message/); // eslint-disable-line
      response.should.have.a.deep.property('attachments[0].color', '#0B3D91');

      response = slack.getHelpResponse([]);
      response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
      response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);
      response.should.have.a.deep.property('attachments[0].pretext').that.matches(/^Welcome to the spacebot Bot/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/Displays this help message/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/\/spacebot help - Displays this help message/); // eslint-disable-line
      response.should.have.a.deep.property('attachments[0].color', '#0B3D91');
    });
    it('Should return Teams formatted help response', () => {
      const response = slack.getHelpResponse(['teams']);
      response.should.have.a.property('response_type').that.is.a('string').that.equals('ephemeral');
      response.should.have.a.property('attachments').that.is.an('array').with.lengthOf(1);
      response.should.have.a.deep.property('attachments[0].pretext').that.matches(/^Welcome to the spacebot Bot/);
      response.should.have.a.deep.property('attachments[0].text').that.matches(/@spacebot help - Displays this help message/); // eslint-disable-line
      response.should.have.a.deep.property('attachments[0].color', '#0B3D91');
    });
  });
});
