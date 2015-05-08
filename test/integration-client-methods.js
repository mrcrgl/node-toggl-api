'use strict';

var chai = require('chai'),
    expect = chai.expect,
    TogglClient = require('../lib/client');

var testBindings = [
    // prototype/workspaces.js
    { cmd: 'getWorkspaces', args: [], fixtureToMatch: 'workspaces.json' },
    { cmd: 'getWorkspaceData', args: [123], fixtureToMatch: 'workspace.json', wrapped: true },
    { cmd: 'updateWorkspace', args: [123, { data: 'object'} ], fixtureToMatch: 'workspace.json', wrapped: true },
    { cmd: 'getWorkspaceProjects', args: [123], fixtureToMatch: 'workspace-projects.json' },
    { cmd: 'getWorkspaceTags', args: [123], fixtureToMatch: 'workspace-tags.json' },
    { cmd: 'getWorkspaceTasks', args: [123], fixtureToMatch: 'workspace-tasks.json' },
    { cmd: 'getWorkspaceUsers', args: [123], fixtureToMatch: 'workspace-users.json' },

    // prototype/workspace_users.js
    { cmd: 'inviteUsers', args: [123, ['john.doe@funk.it']], fixtureToMatch: 'workspace-users-invite.json',
        wrapped: true },
    { cmd: 'updateWorkspaceUser', args: [3123855, { users: 'definition' }], fixtureToMatch: 'workspace_user.json',
        wrapped: true },
    { cmd: 'deleteWorkspaceUser', args: [3123855] },

    // prototype/user.js
    { cmd: 'updateUserData', args: [{ data: 'object' }], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'resetApiToken', args: [], wrapped: true },
    { cmd: 'getUserData', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'changeUserPassword', args: ['oldpass', 'newpass'], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/time_entries.js
    { cmd: 'addTimeEntriesTags', args: [[12345, 54321], 'tagname'], fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'removeTimeEntriesTags', args: [[12345, 54321], 'tagname'], fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'updateTimeEntriesTags', args: [[12345, 54321], 'tagname', 'add'],
        fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'updateTimeEntriesTags', args: [[12345, 54321], 'tagname', 'remove'],
        fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'createTimeEntry', args: [{ start: "2013-03-05T07:58:58.000Z", duration: 1200 }],
        fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'updateTimeEntry', args: [12345, { data: 'object' }], fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'deleteTimeEntry', args: [12345], wrapped: true },
    { cmd: 'getTimeEntryData', args: [12345], fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'getTimeEntries', args: [], fixtureToMatch: 'time-entries.json' },
    { cmd: 'startTimeEntry', args: [{}], fixtureToMatch: 'time-entry.json', wrapped: true },
    { cmd: 'stopTimeEntry', args: [12345], fixtureToMatch: 'time-entry.json', wrapped: true },


    // prototype/tasks.js
    { cmd: 'createTask', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteTask', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteTasks', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getTaskData', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateTask', args: [], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/tags.js
    { cmd: 'createTag', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteTag', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateTagName', args: [], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/reports.js
    { cmd: 'detailedReport', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'summaryReport', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'weeklyReport', args: [], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/projects.js
    { cmd: 'createProject', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteProject', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteProjects', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getProjectData', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getProjectTasks', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getProjectUsers', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateProject', args: [], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/project_users.js
    { cmd: 'addProjectUser', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'addProjectUsers', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteProjectUser', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteProjectUsers', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateProjectUser', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateProjectUsers', args: [], fixtureToMatch: 'me.json', wrapped: true },

    // prototype/dashboard.js
    { cmd: 'getDashboard', args: [123], fixtureToMatch: 'dashboard.json' },

    // prototype/client.js
    { cmd: 'createClient', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'deleteClient', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getClientData', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getClientProjects', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'getClients', args: [], fixtureToMatch: 'me.json', wrapped: true },
    { cmd: 'updateClient', args: [], fixtureToMatch: 'me.json', wrapped: true }


];

describe('togglClient methods', function () {

    var client;

    beforeEach(function () {
        // Reset client before each test
        client = new TogglClient({
            apiUrl: 'http://localhost:7878',
            apiToken: 'some-ascii-string'
        });
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
