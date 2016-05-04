'use strict';
/* eslint import/no-unresolved: 0 */
const v8 = require('v8');
const util = require('util');
function noop() {}

function getDelay(start, interval) {
  const delta = process.hrtime(start);
  const nanosec = delta[0] * 1e9 + delta[1];
  return (nanosec / 1e6 | 0) - interval;
}

function getHeapStatistics() {
  return v8.getHeapStatistics();
}

function get(arr, filter, defaultValue) {
  let result;
  arr.forEach(tmp => {
    if (tmp && filter(tmp)) {
      result = tmp;
    }
  });
  return result || defaultValue;
}

function performance() {
  /* eslint prefer-rest-params: 0 */
  const args = Array.from(arguments);
  const interval = get(args, util.isNumber, 100);
  const fn = get(args, util.isFunction, noop);
  let start = process.hrtime();
  return setInterval(() => {
    fn({
      lag: getDelay(start, interval),
      heap: getHeapStatistics(),
    });
    start = process.hrtime();
  }, interval).unref();
}


module.exports = performance;
