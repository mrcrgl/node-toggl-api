'use strict';

var utils = require('../../utils'),
    proto = {};

/**
 * Get workspace users
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-clients
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, clients)
 */
proto.getWorkspaceClients = function(wId, callback) {
  this._apiRequest('/api/v8/workspaces/' + wId + '/clients', {}, callback);
};

/**
 * Get workspace data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-single-workspace
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, workspace)
 */
proto.getWorkspaceData = function(wId, callback) {
  this._apiRequest('/api/v8/workspaces/' + wId, {}, utils.wrapDataCallback(callback));
};

/**
 * Get workspace projects
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-projects
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} [options] Request options
 * @param {function} callback Accepts arguments: (err, projects)
 */
proto.getWorkspaceProjects = function(wId, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  if (!this._validateOptions('workspace-projects', options, callback)) {
    return;
  }

  var req = {
    qs: options
  };

  this._apiRequest('/api/v8/workspaces/' + wId + '/projects', req, callback);
};

/**
 * Get workspace tags
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tags
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, tags)
 */
proto.getWorkspaceTags = function(wId, callback) {
  this._apiRequest('/api/v8/workspaces/' + wId + '/tags', {}, callback);
};

/**
 * Get workspace tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-tasks
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} [options] Request options
 * @param {function} callback Accepts arguments: (err, tasks)
 */
proto.getWorkspaceTasks = function(wId, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  if (!this._validateOptions('workspace-tasks', options, callback)) {
    return;
  }

  var req = {
    qs: options
  };

  this._apiRequest('/api/v8/workspaces/' + wId + '/tasks', req, callback);
};

/**
 * Get workspace users
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspace-users
 * @see @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspace_users.md#get-workspace-users
 * @public
 * @param {number|string} wId Workspace Id
 * @param {boolean} [actualUsers=true] Return actual users or 'workspace user' objects
 * @param {function} callback Accepts arguments: (err, users)
 */
proto.getWorkspaceUsers = function(wId, actualUsers, callback) {
  if (arguments.length === 2) {
    callback = actualUsers;
    actualUsers = true;
  }

  var url = '/api/v8/workspaces/' + wId;

  if (actualUsers) {
    url += '/users';
  }
  else {
    url += '/workspace_users';
  }

  this._apiRequest(url, {}, callback);
};

/**
 * Get data about all workspaces
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#get-workspaces
 * @public
 * @param {function} callback Accepts arguments: (err, workspaces)
 */
proto.getWorkspaces = function(callback) {
  this._apiRequest('/api/v8/workspaces', {}, callback);
};

/**
 * Update workspace data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/workspaces.md#update-workspace
 * @public
 * @param {number|string} wId Workspace Id
 * @param {object} data Update data
 * @param {function} callback Accepts arguments: (err, workspace)
 */
proto.updateWorkspace = function(wId, data, callback) {
  var req = {
    method: 'PUT',
    body: {
      workspace: data
    }
  };

  this._apiRequest('/api/v8/workspaces/' + wId, req, utils.wrapDataCallback(callback));
};

module.exports = proto;
