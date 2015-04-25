'use strict';

var utils = require('../../utils'),
    proto = {};

/**
 * Create a client
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#create-a-client
 * @public
 * @param {object} data New client data
 * @param {function} callback Accepts arguments: (err, clientData)
 */
proto.createClient = function (data, callback) {
    if (!this._validateOptions('client-create', data, callback)) {
        return;
    }

    var req = {
        method: 'POST',
        body: {
            client: data
        }
    };

    this._apiRequest('/api/v8/clients', req, utils.wrapDataCallback(callback));
};

/**
 * Delete client
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#delete-a-client
 * @public
 * @param {number|string} clientId Client ID
 * @param {function} callback Accepts arguments: (err)
 */
proto.deleteClient = function (clientId, callback) {
    var req = {
        method: 'DELETE'
    };

    this._apiRequest('/api/v8/clients/' + clientId, req, callback);
};

/**
 * Get client details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-client-details
 * @public
 * @param {number|string} clientId Client ID
 * @param {function} callback Accepts arguments: (err, clientData)
 */
proto.getClientData = function (clientId, callback) {
    this._apiRequest('/api/v8/clients/' + clientId, {}, utils.wrapDataCallback(callback));
};

/**
 * Get client projects
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-client-projects
 * @public
 * @param {number|string} clientId Client ID
 * @param {string|boolean} active Filter projects: active (true), archived (false), both
 * @param {function} callback Accepts arguments: (err, projects)
 */
proto.getClientProjects = function (clientId, active, callback) {
    var qs = {
        active: active
    };

    if (!this._validateOptions('client-get-projects', qs, callback)) {
        return;
    }

    this._apiRequest('/api/v8/clients/' + clientId + '/projects', {qs: qs}, callback);
};

/**
 * Get list of clients
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#get-clients-visible-to-user
 * @public
 * @param {function} callback Accepts arguments: (err, clients)
 */
proto.getClients = function (callback) {
    this._apiRequest('/api/v8/clients', {}, callback);
};

/**
 * Update client details
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/clients.md#update-a-client
 * @public
 * @param {number|string} clientId Client ID
 * @param {object} data Client data
 * @param {function} callback Accepts arguments: (err, clientData)
 */
proto.updateClient = function (clientId, data, callback) {
    var req = {
        method: 'PUT',
        body: {
            client: data
        }
    };

    this._apiRequest('/api/v8/clients/' + clientId, req, utils.wrapDataCallback(callback));
};

module.exports = proto;