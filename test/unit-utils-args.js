'use strict';

var chai = require('chai'),
    expect = chai.expect,
    utils = require('../lib/utils');

describe('utils.args', function () {

    it('slices array like objects to arrays', function (done) {
        var myFunc = function () {
            expect(utils.args(arguments)).to.deep.equal([1, 2, 3, 4]);
        };

        myFunc(1, 2, 3, 4);

        done();
    });

});
