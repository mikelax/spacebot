/* eslint consistent-return: [0] */

'use strict';

const Joi = require('joi');
const supertest = require('supertest');

describe('NASA API Validation', () => {
  const API_KEY = 'DEMO_KEY'; // default key allowed for temp NASA calls

  describe('apod', () => {
    const apodImageSchema = Joi.object().keys({
      copyright: Joi.string(),
      date: Joi.string().required(),
      explanation: Joi.string().required(),
      hdurl: Joi.string().uri().required(),
      media_type: Joi.string().required().regex(/image/),
      service_version: Joi.string().required().regex(/v1/),
      title: Joi.string().required(),
      url: Joi.string().uri().required()
    });

    const apodVideoSchema = Joi.object().keys({
      date: Joi.string().required(),
      explanation: Joi.string().required(),
      media_type: Joi.string().required().regex(/video/),
      service_version: Joi.string().required().regex(/v1/),
      title: Joi.string().required(),
      url: Joi.string().uri().required().regex(/youtube\.com/)
    });

    it('should validate api response for image', (done) => {
      supertest('https://api.nasa.gov/planetary/apod')
        .get(`?hd=true&date=2016-10-07&api_key=${API_KEY}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const val = Joi.validate(res.body, apodImageSchema);
          if (val.error) {
            done(val.error);
          } else {
            done();
          }
        });
    });
    it('should validate api response for video', (done) => {
      supertest('https://api.nasa.gov/planetary/apod')
        .get(`?hd=true&date=2016-09-26&api_key=${API_KEY}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const val = Joi.validate(res.body, apodVideoSchema);
          if (val.error) {
            done(val.error);
          } else {
            done();
          }
        });
    });
  });

  describe('mars rovers photos', () => {
    const itemSchema = Joi.object().keys({
      id: Joi.number().required(),
      sol: Joi.number().required(),
      img_src: Joi.string().uri().required(),
      earth_date: Joi.string().required(),
      camera: Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().required(),
        rover_id: Joi.number().required(),
        full_name: Joi.string().required()
      }),
      // We don't need to validate the rover object in each photo
      rover: Joi.object().required()
    });
    const roversSchema = Joi.object().keys({
      photos: Joi.array().items(itemSchema)
    });

    it('should validate api response for rovers photos', (done) => {
      supertest('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos')
        .get(`?sol=1478&api_key=${API_KEY}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const val = Joi.validate(res.body, roversSchema);
          if (val.error) {
            done(val.error);
          } else {
            done();
          }
        });
    });
  });
});
