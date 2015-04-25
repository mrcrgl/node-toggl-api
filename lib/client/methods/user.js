'use strict';


var TogglClient = require('../'),
    utils = require('../../utils'),
    method = {};

/**
 * Create new user
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/users.md#sign-up-new-user
 * @public
 * @static
 * @param {string} email User e-mail address
 * @param {string} password User password
 * @param {string} [timezone] Timezone. UTC by default.
 * @param {function} callback Accepts arguments: (err, userData)
 */
method.createUser = function(email, password, timezone, callback) {
    if (arguments.length === 3) {
        callback = timezone;
        timezone = 'UTC';
    }

    var req = {
        method: 'POST',
        noauth: true,
        body:   {
            user: {
                email:        email,
                password:     password,
                timezone:     timezone,
                created_with: TogglClient.USER_AGENT
            }
        }
    };

    TogglClient.defaultClient().apiRequest('/api/v8/signups', req, utils.wrapDataCallback(callback));
};

module.exports = method;
