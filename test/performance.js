'use strict';
const assert = require('assert');
const util = require('util');
const performance = require('..');


describe('performance-nodejs', () => {
  it('get performance success', done => {
    const timer = performance(data => {
      assert(util.isNumber(data.lag));
      assert(data.heap.total_heap_size);
      assert(data.heap.total_heap_size_executable);
      assert(data.heap.total_physical_size);
      assert(data.heap.total_available_size);
      assert(data.heap.used_heap_size);
      assert(data.heap.heap_size_limit);
      done();
      clearInterval(timer);
    }, 'MB', 10);
  });

  it('set heap unit GB success', done => {
    const timer = performance(data => {
      assert(util.isNumber(data.lag));
      assert(data.heap.total_heap_size);
      assert(data.heap.total_heap_size_executable);
      assert(data.heap.total_physical_size);
      assert(data.heap.total_available_size);
      assert(data.heap.used_heap_size);
      assert(data.heap.heap_size_limit);
      done();
      clearInterval(timer);
    }, 'GB', 10);
  });

  it('no callback', done => {
    const timer = performance(10);
    setTimeout(done, 200);
  });
});