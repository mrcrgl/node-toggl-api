'use strict';

var chai = require('chai'),
    expect = chai.expect,
    TogglClient = require('../lib/client');

describe('togglClient.authenticate', function () {

    var client = new TogglClient({
        apiUrl: 'http://localhost:7878',
        username: 'max',
        password: 'testing'
    });

    var clientUsingApiKey = new TogglClient({
        apiUrl: 'http://localhost:7878',
        apiToken: 'some-ascii-string'
    });

    it('returns expected user object', function (done) {

        // TODO: This is bogus, guess this method isn't used anymore
        // Callback is not be executed, weird...
        client.authenticate(function (err, info) {
            expect(info).to.be.deep.equal(require('../fixtures/mocks/me.json').data);
            done();
        });
    });

    it('throws an error if apiToken is defined', function (done) {

        var doIt = function () {
            clientUsingApiKey.authenticate(function (err) {
                if (err) {
                    throw err;
                }
            });
        };

        expect(doIt).to.throw(Error);
        done();
    });

});
