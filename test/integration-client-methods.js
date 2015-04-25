'use strict';

var chai = require('chai'),
    expect = chai.expect,
    TogglClient = require('../lib/client');

var testBindings = [
    { cmd: 'getWorkspaces', args: [], fixtureToMatch: 'workspaces.json' },
    { cmd: 'getWorkspaceData', args: [123], fixtureToMatch: 'workspace.json', wrapped: true },
    { cmd: 'updateWorkspace', args: [123, { data: 'object'} ], fixtureToMatch: 'workspace.json', wrapped: true },
    { cmd: 'getWorkspaceProjects', args: [123], fixtureToMatch: 'workspace-projects.json' },
    { cmd: 'getWorkspaceTags', args: [123], fixtureToMatch: 'workspace-tags.json' },
    { cmd: 'getWorkspaceTasks', args: [123], fixtureToMatch: 'workspace-tasks.json' },
    { cmd: 'getWorkspaceUsers', args: [123], fixtureToMatch: 'workspace-users.json' },

    { cmd: 'inviteUsers', args: [123, ['john.doe@funk.it']], fixtureToMatch: 'workspace-users-invite.json',
        wrapped: true },
    { cmd: 'updateWorkspaceUser', args: [3123855, { users: 'definition' }], fixtureToMatch: 'workspace_user.json',
        wrapped: true },
    { cmd: 'deleteWorkspaceUser', args: [3123855] }


    // deleteWorkspaceUser ->
    // inviteUsers
    // updateWorkspaceUser

];

describe('togglClient methods', function () {

    var client = new TogglClient({
        apiUrl: 'http://localhost:7878',
        apiToken: 'some-ascii-string'
    });

    testBindings.forEach(function (b) {

        it('handles gracefully ' + b.cmd + (b.args.length ? '(' + b.args.join(', ') + ')' : ''), function (done) {
            var args = b.args.slice();
            args.push(function (err, data) {
                expect(err).to.be.equal(null);

                if (b.fixtureToMatch) {
                    var expextedResult = require('../fixtures/mocks/' + b.fixtureToMatch);
                    if (b.wrapped) {
                        expextedResult = expextedResult.data;
                    }
                    expect(data).to.be.deep.equal(expextedResult);
                }

                expect(err).not.to.be.an('object');
                done();
            });

            client[b.cmd].apply(client, args);
        });
    });

});
