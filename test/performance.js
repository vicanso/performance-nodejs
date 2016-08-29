'use strict';
const assert = require('assert');
const util = require('util');
const performance = require('..');


describe('performance-nodejs', () => {
  it('get performance success', done => {
    const timer = performance(data => {
      console.dir(data);
      assert(util.isNumber(data.lag));
      const heapData = data.heap;
      const keys = Object.keys(heapData);
      keys.forEach(key => {
        const v = heapData[key];
        assert(v);
        assert.equal(parseInt(v), v);
      });
      done();
      clearInterval(timer);
    }, 'MB', 10);
  });

  it('set heap unit 0.00GB success', done => {
    const timer = performance(data => {
      assert(util.isNumber(data.lag));
      const heapData = data.heap;
      const keys = Object.keys(heapData);
      keys.forEach(key => {
        const v = heapData[key];
        assert(v);
        assert.notEqual(parseInt(v), v);
      });
      done();
      clearInterval(timer);
    }, '0.00GB', 10);
  });

  it('no callback', done => {
    const timer = performance(10);
    setTimeout(done, 200);
  });
});