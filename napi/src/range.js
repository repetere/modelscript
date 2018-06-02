const bindings = require('bindings')('range');

module.exports = {
    range: bindings.range,
    rangeRight(start, end, step) {
        return bindings.range(start, end, step, true);
    },
};
