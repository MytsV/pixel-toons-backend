const request = require('supertest');

const app = require('../src/server');

it('Posts should not be broken', (done) => {
  request(app).get('/api/post').expect(200).end(done);
});

it('Users should not be broken', (done) => {
  request(app).get('/api/user').expect(200).end(done);
});
