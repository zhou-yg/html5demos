var name = 'a.js';

exports.afterName = function (str) {
    name += str;
    return name;
};