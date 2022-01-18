
const util = require("util");

const nullLog = function LOG() {};

const realLog = function LOG() {
  for (const i in arguments)
    if (arguments[i] instanceof Object || arguments[i] instanceof Array)
      arguments[i] = util.inspect(arguments[i]);
  console.log("[DEBUG] " + Array.prototype.join.call(arguments, " "));
};

const LOG = nullLog;

module.exports = function () {
  LOG.apply(null, arguments);
};

module.exports.toggle = function (enabled) {
  LOG = !enabled ? nullLog : realLog;
  return module.exports;
};
