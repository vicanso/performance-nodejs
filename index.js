'use strict';
/* eslint import/no-unresolved: 0 */
const v8 = require('v8');
const util = require('util');
const MB = 1024 * 1024;
const GB = MB * 1204;
function noop() {}

function getDelay(start, interval) {
  const delta = process.hrtime(start);
  const nanosec = delta[0] * 1e9 + delta[1];
  return Math.max((nanosec / 1e6 | 0) - interval, 0);
}

function format(value, unit) {
  if (unit === 'GB') {
    return value / GB;
  }
  return value / MB;
}

function getHeapStatistics(unit) {
  const data = v8.getHeapStatistics();
  if (unit === 'B') {
    return data;
  }
  const keys = Object.keys(data);
  const result = {};
  keys.forEach(key => {
    result[key] = format(data[key], unit);
  });
  return result;
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
  const unit = get(args, util.isString, 'B').toUpperCase();
  let start = process.hrtime();
  return setInterval(() => {
    fn({
      lag: getDelay(start, interval),
      heap: getHeapStatistics(unit),
    });
    start = process.hrtime();
  }, interval).unref();
}


module.exports = performance;
