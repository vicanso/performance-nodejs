'use strict';
const v8 = require('v8');
const noop = function() {};
module.exports = performance;

function performance(fn, interval) {
	interval = interval || 100;
	fn = fn || noop;
	let start = process.hrtime();
	return setInterval(() => {
		fn({
			lag: getDelay(start, interval),
			heap: getHeapStatistics()
		});
		start = process.hrtime();
	}, interval).unref();
}


function getDelay(start, interval) {
	const delta = process.hrtime(start);
	const nanosec = delta[0] * 1e9 + delta[1];
	return (nanosec / 1e6 | 0) - interval;
}

function getHeapStatistics() {
	return v8.getHeapStatistics();
}
