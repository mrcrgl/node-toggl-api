'use strict';

var moment = require('moment'),
    ValidateError = require('./errors').ValidateError,
    specs = require('../data/api_params'),
    utils = require('./utils');

function validateSimpleType(spec, options, key) {
    var value = options[key];

    if (spec.default && value === undefined) {
        value = options[key] = spec.default;
    }

    if (spec.default === value && !spec.required) {
        delete options[key];
    }

    return value;
}

function validateDateType(spec, options, key) {
    var value = options[key],
        defaultValue;

    if (spec.default) {
        defaultValue = moment().add(spec.default).format(spec.format);
    }

    if (!value) {
        value = options[key] = defaultValue;
    } else {
        value = moment(value, spec.format);

        if (!value.isValid()) {
            value = moment(value);
        }

        if (!value.isValid()) {
            throw new ValidateError('Unknown date');
        }

        value = value.format(spec.format);
    }

    if (defaultValue === value && !spec.required) {
        delete options[key];
    }

    return value;
}

function validateEnumType(spec, options, key) {
    var value = options[key];

    if (value !== undefined && (spec.values.indexOf(value) + spec.values.indexOf(value + '')) === -2) {
        throw new ValidateError('Value does not match any of allowed', spec, value);
    }

    return value;
}

var validationMapper = {
    date: validateDateType,
    enum: validateEnumType,
    boolean: validateSimpleType,
    number: validateSimpleType,
    string: validateSimpleType
};

/**
 * Validate value using key specification
 *
 * @param {object} spec
 * @param {object} options
 * @param {string} key
 * @returns {ValidateError|null}
 */
function validator(spec, options, key) {
    var value = options[key],
        specValidator = validationMapper[spec.type];

    if ('function' === typeof specValidator) {
        try {
            value = specValidator(spec, options, key);
        } catch (e) {
            return e;
        }
    }

    if (spec.required && value === undefined) {
        return new ValidateError(key + ' is required');
    }

    return null;
}

function validateSchemaSpec(schema, key, options) {
    var spec = schema[key];

    // do nothing with keys for which default value is null
    if (spec === null || spec === undefined) {
        return;
    }

    if (spec === 'required') {
        spec = {
            required: true
        };

        schema[key] = spec;
    } else if (typeof spec !== 'object') {
        spec = {
            type: typeof spec,
            default: spec
        };

        schema[key] = spec;
    }

    return validator(spec, options, key);
}

/**
 * Validate request options
 *
 * @param {object|string} schema Validation schema or schema Id
 * @param {object} options Options to validate
 * @returns {ValidateError|null}
 */
module.exports = function validate(schema, options) {
    var key, error;

    if (typeof schema === 'string') {
        if (!specs.hasOwnProperty(schema)) {
            return new ValidateError('Unknown validation schema: ' + schema);
        }

        schema = specs[schema];
    }

    options = utils.transformObjectKeys(options);

    for (key in schema) {
        if (!schema.hasOwnProperty(key)) {
            continue;
        }

        error = validateSchemaSpec(schema, key, options);

        if (error) {
            return error;
        }
    }

    return null;
};
