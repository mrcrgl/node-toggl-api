'use strict';

var chai = require('chai'),
    expect = chai.expect,
    utils = require('../lib/utils');

describe('utils.camelCaseToUnderscore', function () {

    it('transforms camel-case strings to lower-case underscore-separated ones', function (done) {
        var testStrings = [
            { test: 'verySimpleExample', expect: 'very_simple_example' },
            { test: 'SimpleExample', expect: 'simple_example' },
            { test: 'already_done', expect: 'already_done' },
            { test: 'This is another test', expect: 'this is another test' },
            { test: '123Number', expect: '123_number' },
            { test: 'Numbers123Test', expect: 'numbers123_test' },
            // Disabled, see doc type of method
            // { test: 'UnicodeÄexample', expect: 'unicode_äexample' },
            { test: undefined, expect: undefined },
            { test: null, expect: null },
        ];

        testStrings.forEach(function (t) {
            expect(utils.camelCaseToUnderscore(t.test)).to.equal(t.expect);
        });

        done();
    });

});
