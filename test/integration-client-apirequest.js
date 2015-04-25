'use strict';

var chai = require('chai'),
    expect = chai.expect,
    // APIError = require('../lib/errors'),
    TogglClient = require('../lib/client');

describe('togglClient.apiRequest', function () {

    var client;

    beforeEach(function () {
        client = new TogglClient({
            apiUrl: 'http://localhost:7878',
            apiToken: 'some-ascii-string'
        });
    });

    it('returns an object with content-type: application/json', function (done) {
        client._apiRequest('/api/v8/workspaces/123', function (err, data) {
            expect(data).to.be.an('object');
            done();
        });
    });

    it('handles status code 2xx', function (done) {
        client._apiRequest('/api/v8/me', function (err, data) {
            expect(err).not.to.be.an('object');
            expect(data).to.be.an('object');
            done();
        });
    });

    it('handles status code 4xx', function (done) {
        client._apiRequest('/will-raise-404', function (err) {
            expect(err).to.be.an('object');
            expect((err || {}).code).to.be.equal(404);
            done();
        });
    });

    it('handles status code 5xx', function (done) {
        client._apiRequest('/will-raise-500', function (err) {
            expect(err).to.be.an('object');
            expect((err || {}).code).to.be.equal(500);
            done();
        });
    });

});
