const _ = require('lodash');

const pick = (object,paths) => _.pick(object,paths);

exports.pick = pick;