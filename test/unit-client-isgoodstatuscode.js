'use strict';

var chai = require('chai'),
    expect = chai.expect,
    TogglClient = require('../lib/client');

describe('togglClient._isGoodStatusCode', function () {

    var client = new TogglClient({
        apiUrl: 'http://localhost:7878',
        username: 'max',
        password: 'testing'
    });

    it('returns true for 2x status-codes', function (done) {
        for (var i = 200; i <= 299; i += 1) {
            expect(client._isGoodStatusCode(200)).to.be.true;
        }
        done();
    });

    it('returns false for non-2x status-codes', function (done) {
        var i;
        for (i = 100; i <= 199; i += 1) {
            expect(client._isGoodStatusCode(i)).to.be.false;
        }
        for (i = 300; i <= 599; i += 1) {
            expect(client._isGoodStatusCode(i)).to.be.false;
        }
        done();
    });

});
