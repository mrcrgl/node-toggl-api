'use strict';

var chai = require('chai'),
    expect = chai.expect,
    utils = require('../lib/utils');

describe('utils.wrapDataCallback', function () {

    it('returns a function', function (done) {
        expect(typeof utils.wrapDataCallback(function () {})).to.equal('function');

        done();
    });

    it('forwards errors to given callback', function (done) {

        var myFunc = utils.wrapDataCallback(function (err, mixed) {
            expect(err).to.be.an.instanceof(Error);
            expect(mixed).to.be.an('undefined');
        });

        myFunc(new Error('test'));

        done();
    });

    it('does not return any data if an error occurred', function (done) {

        var myFunc = utils.wrapDataCallback(function (err, mixed) {
            expect(err).to.be.an.instanceof(Error);
            expect(mixed).to.be.an('undefined');
        });

        myFunc(new Error('test'), { data: [1, 2, 3] });

        done();
    });

    it('returns only content of {data:}', function (done) {

        var myFunc = utils.wrapDataCallback(function (err, mixed) {
            expect(mixed).to.deep.equal([1, 2, 3]);
        });

        myFunc(null, { data: [1, 2, 3] });

        done();
    });

});
