'use strict';

var utils = require('../../utils'),
    proto = {};

/**
 * Change user password
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {string} [currentPassword] Current password
 * @param {string} password New password
 * @param {function} callback Accepts arguments: (err)
 */
proto.changeUserPassword = function(currentPassword, password, callback) {
  if (arguments.length === 2) {
    callback = password;
    password = currentPassword;
    currentPassword = this.options.password;
  }

  if (!currentPassword) {
    return callback(new Error('Current password is unknown.'));
  }

  var req = {
    method: 'PUT',
    body: {
      user: {
        current_password: currentPassword,
        password: password
      }
    }
  };

  this._apiRequest('/api/v8/me', req, utils.wrapDataCallback(callback));
};

/**
 * Get user data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#get-current-user-data
 * @public
 * @param {object} options Request options
 * @param {function} callback Accepts arguments: (err, userData)
 */
proto.getUserData = function(options, callback) {
  if (!this.validateOptions('user-data-get', options, callback)) {
    return;
  }

  this._apiRequest('/api/v8/me', {qs: options}, utils.wrapDataCallback(callback));
};

/**
 * Reset API token
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#reset-api-token
 * @public
 * @param {function} callback Accepts arguments: (err)
 */
proto.resetApiToken = function(callback) {
  var req = {
    method: 'POST'
  };

  if (this.options.apiToken) {
    var self = this,
        original = callback;

    callback = function(err, token) {
      if (err) {
        original(err);
      }
      else {
        self.options.apiToken = token;
        original(null, token);
      }
    };
  }

  this._apiRequest('/api/v8/reset_token', req, callback);
};




/**
 * Update user data
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#update-user-data
 * @public
 * @param {object} data Update data
 * @param {function} callback
 */
proto.updateUserData = function(data, callback) {
  if (!this._validateOptions('user-data-set', data, callback)) {
    return;
  }

  var req = {
    method: 'PUT',
    body:   {
      user: data
    }
  };

  this._apiRequest('/api/v8/me', req, utils.wrapDataCallback(callback));
};

module.exports = proto;
