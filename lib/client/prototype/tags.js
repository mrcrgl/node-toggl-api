'use strict';

var utils = require('../../utils'),
    proto = {};




/**
 * Create tag
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#create-tag
 * @public
 * @param {string} name Tag name
 * @param {number|string} workspaceId Workspace ID
 * @param {function} callback Accepts arguments: (err, tag)
 */
proto.createTag = function(name, workspaceId, callback) {
  var tag = {
    name: name,
    wid:  workspaceId
  };

  if (!this._validateOptions('tag-create', tag, callback)) {
    return;
  }

  var req = {
    method: 'POST',
    body:   {
      tag: tag
    }
  };

  this._apiRequest('/api/v8/tags', req, utils.wrapDataCallback(callback));
};




/**
 * Delete tag
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#delete-a-tag
 * @public
 * @param {number|string} tagId Tag Id
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteTag = function(tagId, callback) {
  var req = {
    method: 'DELETE'
  };

  this._apiRequest('/api/v8/tags/' + tagId, req, callback);
};

/**
 * Update tag name
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/tags.md#update-a-tag
 * @public
 * @param {number|string} tagId Tag Id
 * @param {string} name New tag name
 * @param {function} callback Accepts arguments: (err, tag)
 */
proto.updateTagName = function(tagId, name, callback) {
  var tag = {
    name: name
  };

  if (!this.validateOptions('tag-update', tag, callback)) {
    return;
  }

  var req = {
    method: 'PUT',
    body:   {
      tag: tag
    }
  };

  this._apiRequest('/api/v8/tags/' + tagId, req, utils.wrapDataCallback(callback));
};

module.exports = proto;
