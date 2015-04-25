'use strict';

var slice = Array.prototype.slice;

var utils = {};

/**
 * Arguments object to array
 *
 * @param {Arguments} args
 * @returns {Array}
 */
utils.args = function (args) {
    return slice.call(args, 0);
};

/**
 * Wrap request callback inside helper which returns response "data" object in case of success
 *
 * @param {function} callback Accepts arguments: (err, userData)
 */
utils.wrapDataCallback = function wrapDataCallback(callback) {
    return function onResponse(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res.data);
        }
    };
};

/**
 * Converts all keys of an object via utils.camelCaseToUnderscore
 *
 * @param dict
 * @returns {*}
 */
utils.transformObjectKeys = function transformObjectKeys(dict) {
    var keys = Object.keys(dict),
        transformedKeys = keys.map(utils.camelCaseToUnderscore),
        len = keys.length;

    for (var i = 0; i<= len; i += 1) {
        if (transformedKeys[i] !== keys[i]) {
            dict[transformedKeys[i]] = dict[keys[i]];
            delete dict[keys[i]];
        }
    }

    return dict;
};

/**
 * Camel-case to underscored string
 *
 * NOTE: There's actually no compatible regex to match all unicode uppercase characters.
 *       In perl you can use \p{Uppercase} but this is not ported.
 *
 * @param {string} camelCase
 * @returns {string}
 */
utils.camelCaseToUnderscore = function camelCaseToUnderscore(camelCase) {
    if ('string' !== typeof camelCase) {
        return camelCase;
    }

    return camelCase.replace(/.([A-Z])/g, function(string) {
        return string.charAt(0) + '_' + string.charAt(1);
    }).toLowerCase();
};

module.exports = utils;
