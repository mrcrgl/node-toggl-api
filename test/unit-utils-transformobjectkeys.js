'use strict';

var chai = require('chai'),
    expect = chai.expect,
    utils = require('../lib/utils');

describe('utils.transformObjectKeys', function () {

    it('adds transformed key with same value', function (done) {
        var testObject = {
            nullValue: null,
            simpleValue: true,
            already_fine: 'Test',
            complexValue: {
                array: [1, 2, 3]
            }
        };
        var expectObject = {
            null_value: null,
            simple_value: true,
            already_fine: 'Test',
            complex_value: {
                array: [1, 2, 3]
            }
        };

        expect(utils.transformObjectKeys(testObject)).to.deep.equal(expectObject);

        done();
    });

    it('adds removed obsolete keys', function (done) {
        var testObject = {
            nullValue: null,
            simpleValue: true,
            already_fine: 'Test',
            complexValue: {
                array: [1, 2, 3]
            }
        };

        expect(utils.transformObjectKeys(testObject)).not.to.have.all.keys('nullValue', 'simpleValue', 'complexValue');

        done();
    });

});
