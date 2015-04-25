'use strict';

var utils = require('../../utils'),
    proto = {};

/**
 * Create a project
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#create-project
 * @public
 * @param {object} data New project data
 * @param {function} callback Accepts arguments: (err, projectData)
 */
proto.createProject = function(data, callback) {
  if (!this._validateOptions('project-create', data, callback)) {
    return;
  }

  var req = {
    method: 'POST',
    body:   {
      project: data
    }
  };

  this._apiRequest('/api/v8/projects', req, utils.wrapDataCallback(callback));
};

/**
 * Delete project
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#delete-a-project
 * @public
 * @param {number|string} projectId Project ID
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteProject = function(projectId, callback) {
  var req = {
    method: 'DELETE'
  };

  this._apiRequest('/api/v8/projects/' + projectId, req, callback);
};

/**
 * Delete projects
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#delete-multiple-projects
 * @public
 * @param {number[]|string[]} projectIds Project IDs
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteProjects = function(projectIds, callback) {
  if (arguments.length > 2 || !Array.isArray(projectIds)) {
    projectIds = [].slice.call(arguments, 0);
    callback = projectIds.pop();
  }

  this.deleteProject(projectIds.join(), callback);
};

/**
 * Get project data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-data
 * @public
 * @param {number|string} projectId Project ID
 * @param {function} callback Accepts arguments: (err, projectData)
 */
proto.getProjectData = function (projectId, callback) {
  this._apiRequest('/api/v8/projects/' + projectId, {}, utils.wrapDataCallback(callback));
};

/**
 * Get project tasks list
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-tasks
 * @public
 * @param {number|string} projectId Project ID
 * @param {function} callback Accepts arguments: (err, tasks)
 */
proto.getProjectTasks = function(projectId, callback) {
  this._apiRequest('/api/v8/projects/' + projectId + '/tasks', {}, callback);
};

/**
 * Get project users list
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#get-project-users
 * @public
 * @param {number|string} projectId Project ID
 * @param {function} callback Accepts arguments: (err, users)
 */
proto.getProjectUsers = function(projectId, callback) {
  this._apiRequest('/api/v8/projects/' + projectId + '/users', {}, callback);
};

/**
 * Update project details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/projects.md#update-project-data
 * @public
 * @param {number|string} projectId project ID
 * @param {object} data Project data
 * @param {function} callback Accepts arguments: (err, projectData)
 */
proto.updateProject = function(projectId, data, callback) {
  var req = {
    method: 'PUT',
    body:   {
      project: data
    }
  };

  this._apiRequest('/api/v8/projects/' + projectId, req, utils.wrapDataCallback(callback));
};

module.exports = proto;
