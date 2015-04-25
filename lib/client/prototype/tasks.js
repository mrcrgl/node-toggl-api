'use strict';

var utils = require('../../utils'),
    proto = {};




/**
 * Create task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#create-a-task
 * @public
 * @param {string} name Task name
 * @param {number|string} projectId ID of project for what task is created
 * @param {object} data Task options
 * @param {function} callback Accepts arguments: (err, task)
 */
proto.createTask = function(name, projectId, data, callback) {
  data.name = name;
  data.pid = projectId;

  var req = {
    method: 'POST',
    body:   {
      task: data
    }
  };

  this._apiRequest('/api/v8/tasks', req, utils.wrapDataCallback(callback));
};




/**
 * Delete task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#delete-a-task
 * @public
 * @param {number|string} taskId Task ID
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteTask = function(taskId, callback) {
  var req = {
    method: 'DELETE'
  };

  this._apiRequest('/api/v8/tasks/' + taskId, req, callback);
};




/**
 * Delete several tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#delete-multiple-tasks
 * @public
 * @param {number[]|string[]} taskIds Task IDs
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteTasks = function(taskIds, callback) {
  this.deleteTask(taskIds.join(), callback);
};




/**
 * Get task details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#get-task-details
 * @public
 * @param {number|string} taskId Task ID
 * @param {function} callback Accepts arguments: (err, task)
 */
proto.getTaskData = function(taskId, callback) {
  this._apiRequest('/api/v8/tasks/' + taskId, {}, utils.wrapDataCallback(callback));
};




/**
 * Update task
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#update-a-task
 * @public
 * @param {number|string} taskId Task ID
 * @param {object} data Update data
 * @param {string[]} [fields] Fields to include into output
 * @param {function} callback Accepts arguments: (err, task)
 */
proto.updateTask = function(taskId, data, fields, callback) {
  if (arguments.length === 3) {
    callback = fields;
    fields = null;
  }

  if (fields) {
    data.fields = fields.join();
  }

  var req = {
    method: 'PUT',
    body:   {
      task: data
    }
  };

  this._apiRequest('/api/v8/tasks/' + taskId, req, utils.wrapDataCallback(callback));
};




/**
 * Update tasks
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tasks.md#update-multiple-tasks
 * @public
 * @param {number[]|string[]} taskIds Task IDs
 * @param {object} data Update data
 * @param {string[]} [fields] Fields to include into output
 */
proto.updateTasks = function(taskIds/*, data, fields, callback*/) {
  var args = utils.args(arguments);
  args[0] = (taskIds||[]).join();
  this.updateTask.apply(this, args);
};

module.exports = proto;
