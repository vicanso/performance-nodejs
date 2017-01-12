'use strict';

/* eslint import/no-unresolved: 0 */
const v8 = require('v8');
const util = require('util');

const MB = 1024 * 1024;
const GB = MB * 1204;
function noop() {}

function getDelay(start, interval) {
  const delta = process.hrtime(start);
  const nanosec = (delta[0] * 1e9) + delta[1];
  /* eslint no-bitwise: ["error", { "int32Hint": true }] */
  return Math.max((nanosec / 1e6 | 0) - interval, 0);
}

function format(value, unitInfo) {
  const unit = unitInfo.unit;
  const precision = unitInfo.precision || 0;
  let v = 0;
  switch (unit) {
    case 'GB':
      v = value / GB;
      break;
    case 'MB':
      v = value / MB;
      break;
    default:
      v = value;
      break;
  }
  v = parseFloat(Number(v).toFixed(precision));
  return v;
}

function getHeapStatistics(unit) {
  const data = v8.getHeapStatistics();
  const keys = Object.keys(data);
  const result = {};
  keys.forEach((key) => {
    result[key] = format(data[key], unit);
  });
  return result;
}

function getHeapSpaceStatistics(unit) {
  if (!v8.getHeapSpaceStatistics) {
    return null;
  }
  const arr = v8.getHeapSpaceStatistics();
  const result = {};
  arr.forEach((item) => {
    const data = {};
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (key === 'space_name') {
        return;
      }
      data[key.replace('space_', '')] = format(item[key], unit);
    });
    result[item.space_name] = data;
  });
  return result;
}

function get(arr, filter, defaultValue) {
  let result;
  arr.forEach((tmp) => {
    if (tmp && filter(tmp)) {
      result = tmp;
    }
  });
  return result || defaultValue;
}

function formatUnit(str) {
  const reg = /\.\d*/;
  const result = reg.exec(str);
  if (result && result[0]) {
    return {
      precision: result[0].length - 1,
      unit: str.substring(result[0].length + 1),
    };
  }
  return {
    unit: str,
  };
}

function getCpuUsage(previousValue, start) {
  if (!previousValue) {
    return null;
  }
  const usage = process.cpuUsage(previousValue);
  const delta = process.hrtime(start);
  const total = Math.ceil(((delta[0] * 1e9) + delta[1]) / 1000);
  const usedPercent = Math.ceil(((usage.user + usage.system) / total) * 100);
  usage.usedPercent = usedPercent;
  usage.total = total;
  return usage;
}

function performance() {
  /* eslint prefer-rest-params: 0 */
  const args = Array.from(arguments);
  const interval = get(args, util.isNumber, 100);
  const fn = get(args, util.isFunction, noop);
  const unitInfo = formatUnit(get(args, util.isString, 'B').toUpperCase());
  let start = process.hrtime();
  let cpuUsage = process.cpuUsage && process.cpuUsage();
  return setInterval(() => {
    fn({
      lag: getDelay(start, interval),
      heap: getHeapStatistics(unitInfo),
      heapSpace: getHeapSpaceStatistics(unitInfo),
      cpuUsage: getCpuUsage(cpuUsage, start),
    });
    start = process.hrtime();
    cpuUsage = process.cpuUsage && process.cpuUsage();
  }, interval).unref();
}


module.exports = performance;
