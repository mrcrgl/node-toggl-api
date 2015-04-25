'use strict';

var proto = {};

/**
 * Get dashboard for a given workspace
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/dashboard.md#get-dashboard-data
 * @public
 * @param {number|string} wId Workspace Id
 * @param {function} callback Accepts arguments: (err, clients)
 */
proto.getDashboard = function(wId, callback) {
    this._apiRequest('/api/v8/dashboard/' + wId, {}, callback);
};

module.exports = proto;
