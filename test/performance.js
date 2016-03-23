'use strict';
const assert = require('assert');
const performance = require('..');


describe('performance-nodejs', () => {
	it('get performance success', done => {
		const timer = performance(data => {
			assert(data.lag);
			assert(data.heap.total_heap_size);
			assert(data.heap.total_heap_size_executable);
			assert(data.heap.total_physical_size);
			assert(data.heap.total_available_size);
			assert(data.heap.used_heap_size);
			assert(data.heap.heap_size_limit);
			timer.unref();
			done();
		});
		timer.ref();
	});
});