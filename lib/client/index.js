'use strict';

var _ = require('lodash'),
    errors = require('./../errors'),
    utils = require('../utils'),
    request = require('request'),
    validate = require('./../validator'),
    fs = require('fs'),
    VERSION = JSON.parse(fs.readFileSync('package.json')).version,
    APIError = errors.APIError,
    ReportError = errors.ReportError,
    defaultClient;

var defaults = {
    apiUrl: 'https://www.toggl.com',
    reportsUrl: 'https://toggl.com/reports'
};

function noop() {}

/**
 * Toggl API client
 *
 * @constructor
 * @param [options] Client options
 */
function TogglClient(options) {
    /**
     * @private
     */
    this.options = {};
    _.assign(this.options, defaults);

    if (options !== undefined) {
        _.assign(this.options, options);
    }

    this._validateConfiguration(this.options);
}

/**
 * User agent string
 *
 * @public
 * @static
 */
TogglClient.USER_AGENT = 'node-toggl v' + VERSION;

/**
 * Return default API client.
 *
 * This is weird, it is neither a real factory class nor injectable for
 * testing. Maybe a good candidate for deprecation.
 *
 * @public
 * @static
 * @returns {TogglClient}
 */
TogglClient.defaultClient = function () {
    if (!defaultClient) {
        defaultClient = new TogglClient();
    }

    return defaultClient;
};

/**
 * Set default settings for client
 *
 * @public
 * @static
 * @param {object} newDefaults
 */
TogglClient.setDefaults = function (newDefaults) {
    _.assign(defaults, newDefaults);
};

/**
 * Checks the configuration object.
 *
 * @throws Error If something is missing
 * @param options
 * @private
 */
TogglClient.prototype._validateConfiguration = function (options) {
    if (!options.apiToken && (!options.username || !options.password)) {
        throw new Error('You should either specify apiToken or username and password');
    }

    if (!options.apiUrl) {
        throw new Error('Toggl API base URL is not specified');
    }
};

/**
 * Request to Toggl API v8
 *
 * @private
 * @param {string} path API path
 * @param {object} [opts] Request options
 * @param {function} callback Accepts arguments: (err, data)
 * @private
 */
TogglClient.prototype._apiRequest = function (path, opts, callback) {
    if (arguments.length === 2 && 'function' === typeof arguments[1]) {
        callback = arguments[1];
        opts = {};
    }

    opts = this._applyRequestAuth(opts);

    opts.url = this.options.apiUrl + path;
    opts.json = true;
    opts.gzip = true;

    var onResponse = function (err, response, data) {
        if (err) {
            // Handle adapter errors gracefully
            return callback(err);
        }

        if (this._isGoodStatusCode(response.statusCode)) {
            this._applyAPIToken(response, data.data || {});
            return callback(null, data);
        }

        callback(new APIError(response.statusCode, data.data || {}));
    }.bind(this);

    request(opts, onResponse);
};

TogglClient.prototype._isGoodStatusCode = function (statusCode) {
    return (200 <= statusCode && statusCode < 300);
};

/**
 * Applies, whether with username+password or api-key, http basic authentication to request options dict.
 *
 * @param req
 * @returns {*}
 * @private
 */
TogglClient.prototype._applyRequestAuth = function (req) {

    if (this.options.apiToken) {
        req.auth = {
            user: this.options.apiToken,
            pass: 'api_token'
        };
    } else if (this.options.username && this.options.password) {
        req.auth = {
            user: this.options.username,
            pass: this.options.password
        };
    }

    return req;
};

/**
 * Method to extract apiToken if provided in response data.
 * We prefer using the apiToken instead of username:password.
 *
 * @param response
 * @param data
 * @returns {*}
 * @private
 */
TogglClient.prototype._applyAPIToken = function (response, data) {
    if (response.req.path.match(/\/me$/) && undefined !== data.api_token) {
        this.options.apiToken = data.api_token;
        return data.api_token;
    }
};

/**
 * Make authentication call only if you use username & password
 *
 * @see https://github.com/toggl/toggl_api_docs/blob/master/chapters/authentication.md
 * @public
 * @param {function} [callback] Accepts arguments: (err, userData)
 */
TogglClient.prototype.authenticate = function (callback) {
    var self = this,
        options = this.options,
        req = {};

    callback = callback || noop;

    if (!options.username || !options.password) {
        return callback(new Error('No need to authenticate thus you use apiToken'));
    }

    req = this._applyRequestAuth(req);
    req.method = 'GET';

    function done(err, data) {
        self.authData = data;

        callback(err, data);
    }

    this._apiRequest('/api/v8/me', req, utils.wrapDataCallback(done));
};

/**
 * Request to Toggl API v8
 *
 * @private
 * @param {string} path API path
 * @param {object} opts Request options
 * @param {function} callback Accepts arguments: (err, data)
 */
TogglClient.prototype.reportsRequest = function (path, opts, callback) {
    var options = this.options;

    if (!options.apiToken) {
        return callback(new Error('API token is not specified. Reports API can\'t be used.'));
    }

    opts.auth = {
        user: options.apiToken,
        pass: 'api_token'
    };
    opts.url = options.reportsUrl + path;
    opts.json = true;
    opts.qs = opts.qs || {};
    opts.qs.user_agent = TogglClient.USER_AGENT;

    function onResponse(err, response, data) {
        var statusCode = response.statusCode;

        if (err) {
            callback(err);
        }
        else if (statusCode >= 200 && statusCode < 300) {
            callback(null, data);
        }
        else if (data.error) {
            return callback(new ReportError(data.error));
        }
        else {
            return callback(new ReportError('Unknown Reports API error', statusCode, data));
        }
    }

    request(opts, onResponse);
};

/**
 * Validate request options
 *
 * @private
 * @param {object|string} schema Validation schema
 * @param {object} options Request options
 * @param {function} callback Request callback. If validation error is raised it will be called with error.
 * @returns {boolean}
 * @private
 */
TogglClient.prototype._validateOptions = function (schema, options, callback) {
    var error = validate(schema, options);

    if (error) {
        callback(error);
        return false;
    }

    return true;
};

/**
 * Extend TogglClient prototype
 */
var proto = [
    require('./prototype/reports'),
    require('./prototype/user'),
    require('./prototype/clients'),
    require('./prototype/dashboard'),
    require('./prototype/projects'),
    require('./prototype/project_users'),
    require('./prototype/tags'),
    require('./prototype/tasks'),
    require('./prototype/time_entries'),
    require('./prototype/workspaces'),
    require('./prototype/workspace_users')
];

function applyTo(prototype, object) {
    Object.keys(object).forEach(function (key) {
        prototype[key] = object[key];
    });
}

proto.forEach(function (mod) {
    applyTo(TogglClient.prototype, mod);
});

/**
 * Expose client
 */
module.exports = TogglClient;
