'use strict';

module.exports = function (path) {
    console.log(path);
    return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '') + path);
};
