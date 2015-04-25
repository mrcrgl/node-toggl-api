'use strict';

var chai = require('chai'),
    expect = chai.expect,
    TogglClient = require('../lib/client/index');

describe('TogglClient.constructor', function () {

    it('defaultClient acts as a factory', function (done) {

        TogglClient.setDefaults({ username: 'john', password: 'doe' });

        var client1 = TogglClient.defaultClient(),
            client2 = TogglClient.defaultClient();

        expect(client1).to.equals(client2);
        done();
    });

});
