'use strict';

/* eslint import/no-unresolved: 0 */
const v8 = require('v8');
const camelCase = require('camelcase');

const MB = 1024 * 1024;
const GB = MB * 1204;
function noop() {}

function isFunction(value) {
  return typeof value === 'function';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isString(value) {
  return typeof value === 'string';
}

function isObject(value) {
  const type = typeof value;
  return value != null && type === 'object';
}

/**
 * Get the dalay of interval
 * @param {Array} start The start time
 * @param {Number} interval The value of interval, ms
 * @returns {Number} The dalay ms
 */
function getDelay(start, interval) {
  const delta = process.hrtime(start);
  const nanosec = (delta[0] * 1e9) + delta[1];
  /* eslint no-bitwise: ["error", { "int32Hint": true }] */
  return Math.max((nanosec / 1e6 | 0) - interval, 0);
}

/**
 * Format the bytes by unit
 * @param {Number} value Bytes count
 * @param {Object} unitInfo {unit: String, precision: Number}
 * unit: 'GB', 'MB' or 'B'
 * precision: the precision of size, default is 0
 * @returns {Number}
 */
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

/**
 * Get the heap statistics
 * @param {Object} unitInfo The unit format setting
 * @returns {Object} The heap statistics
 */
function getHeapStatistics(unitInfo) {
  const data = v8.getHeapStatistics();
  const keys = Object.keys(data);
  const result = {};
  keys.forEach((key) => {
    result[key] = format(data[key], unitInfo);
  });
  return result;
}

/**
 * Get the heap space statistics
 * @param {Object} unitInfo The unit format setting
 * @returns {Object} The heap space statistics
 */
function getHeapSpaceStatistics(unitInfo) {
  const arr = v8.getHeapSpaceStatistics();
  const result = {};
  arr.forEach((item) => {
    const data = {};
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (key === 'space_name') {
        return;
      }
      // replace the space_ key prefix
      data[key.replace('space_', '')] = format(item[key], unitInfo);
    });
    result[item.space_name] = data;
  });
  return result;
}

/**
 * Get the memory usage
 * @param {Object} unitInfo The unit format setting
 * @returns {Object} The memory usage
 */
function getMemoryUsage(unitInfo) {
  const data = process.memoryUsage();
  const keys = Object.keys(data);
  const result = {};
  keys.forEach((key) => {
    result[key] = format(data[key], unitInfo);
  });
  return result;
}

/**
 * Get the value from array by filter
 * @param {Array} arr The array to filter
 * @param {Function} filter The filter function
 * @param {any} defaultValue The default value for no value is valid
 * @returns {any} The value of filter
 */
function get(arr, filter, defaultValue) {
  let result;
  arr.forEach((tmp) => {
    if (tmp && filter(tmp)) {
      result = tmp;
    }
  });
  return result || defaultValue;
}

/**
 * Convert the unit info
 * @param {String} str The unit info
 * @returns {Object} The format unit info
 */
function convertUnit(str) {
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

/**
 * Get the cpu usage
 * @param {Object} previousValue The previous cpu usage
 * @param {Array} start The previous process.hrtime
 * @returns {Object} The cpu usage {
 *  user: Number,
 *  system: Number,
 *  usedPercent: Number,
 *  userUsedPercent: Number,
 *  systemUsedPercent: Number,
 *  total: total
 * }
 */
function getCpuUsage(previousValue, start) {
  if (!previousValue) {
    return null;
  }
  const usage = process.cpuUsage(previousValue);
  const delta = process.hrtime(start);
  const total = Math.ceil(((delta[0] * 1e9) + delta[1]) / 1000);
  const usedPercent = Math.round(((usage.user + usage.system) / total) * 100);
  usage.usedPercent = usedPercent;
  usage.userUsedPercent = Math.round((usage.user / total) * 100);
  usage.systemUsedPercent = Math.round((usage.system / total) * 100);
  usage.total = total;
  return usage;
}

/**
 * Convert the data to camel case
 *
 * @param {Object} data
 * @returns
 */
function camelCaseData(data) {
  const result = {};
  const keys = Object.keys(data);
  keys.forEach((k) => {
    const key = camelCase(k);
    const value = data[k];
    if (isObject(value)) {
      result[key] = camelCaseData(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

/**
 * Flatten the data
 *
 * @param {Object} data
 * @returns
 */
function flatten(data, pre) {
  const prefix = pre || '';
  const keys = Object.keys(data);
  const result = {};
  keys.forEach((k) => {
    const value = data[k];
    const key = [prefix, k].join('-');
    if (isObject(value)) {
      Object.assign(result, flatten(value, key));
    } else {
      result[key] = value;
    }
  });
  return result;
}

/**
 * Get the performance of node, include lag, heap, heapSpace, cpuUsage, memoryUsage
 * @param {Function} fn The callback function of performance
 * @param {Interval} interval The interval of get performance
 * @returns {Timer} The setInterval timer
 */
function performance() {
  /* eslint prefer-rest-params: 0 */
  const args = Array.from(arguments);
  const interval = get(args, isNumber, 100);
  const fn = get(args, isFunction, noop);
  const unitInfo = convertUnit(get(args, isString, 'B').toUpperCase());
  let start = process.hrtime();
  let cpuUsage = process.cpuUsage && process.cpuUsage();
  const timer = setInterval(() => {
    let result = {
      lag: getDelay(start, interval),
      heap: getHeapStatistics(unitInfo),
      memoryUsage: getMemoryUsage(unitInfo),
    };
    if (cpuUsage) {
      result.cpuUsage = getCpuUsage(cpuUsage, start);
    }
    if (v8.getHeapSpaceStatistics) {
      result.heapSpace = getHeapSpaceStatistics(unitInfo);
    }
    if (performance.flatten) {
      result = flatten(result);
    }
    if (performance.camelCase) {
      result = camelCaseData(result);
    }
    fn(result);
    start = process.hrtime();
    cpuUsage = process.cpuUsage && process.cpuUsage();
  }, interval);
  timer.unref();
  return timer;
}

performance.camelCase = false;

performance.flatten = false;

module.exports = performance;
