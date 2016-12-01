'use strict';
const assert = require('assert');
const util = require('util');
const performance = require('..');


describe('performance-nodejs', () => {
  it('get performance success', done => {
    const timer = performance((data) => {
      assert(util.isNumber(data.lag));
      const heapData = data.heap;
      const keys = Object.keys(heapData);
      keys.forEach((key) => {
        const v = heapData[key];
        assert(util.isNumber(v));
        assert.equal(parseInt(v), v);
      });
      done();
      clearInterval(timer);
    }, 'MB', 10);
  });

  it('set heap unit 0.00GB success', done => {
    const timer = performance((data) => {
      assert(util.isNumber(data.lag));
      const heapData = data.heap;
      const keys = Object.keys(heapData);
      keys.forEach((key) => {
        const v = heapData[key];
        if (key === 'does_zap_garbage') {
          assert.equal(v, 0);
          return;
        }
        assert(util.isNumber(v));
        if (key !== 'malloced_memory') {
          assert.notEqual(parseInt(v), v);
        }
      });
      done();
      clearInterval(timer);
    }, '0.000GB', 10);
  });

  it('no callback', (done) => {
    const timer = performance(10);
    setTimeout(done, 200);
  });
});