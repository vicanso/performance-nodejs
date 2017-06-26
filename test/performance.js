'use strict';
const assert = require('assert');
const util = require('util');
const performance = require('..');


describe('performance-nodejs', () => {
  it('get performance success', (done) => {
    const timer = performance((data) => {
      assert(util.isNumber(data.lag));
      const heapData = data.heap;
      const keys = Object.keys(heapData);
      keys.forEach((key) => {
        const v = heapData[key];
        assert(util.isNumber(v));
        assert.equal(parseInt(v, 10), v);
      });
      const heapSpace = data.heapSpace;
      if (heapSpace) {
        const spaceTypeList = 'new_space old_space code_space map_space'.split(' ');
        const heapSpaceKeys = 'size used_size available_size physical_size'.split(' ');
        spaceTypeList.forEach((type) => {
          heapSpaceKeys.forEach((key) => {
            assert(util.isNumber(heapSpace[type][key]));
          });
        });
      }
      const cpuUsage = data.cpuUsage;
      if (cpuUsage) {
        const usageKeys = 'user system usedPercent userUsedPercent systemUsedPercent total'.split(' ');
        usageKeys.forEach(key => assert(util.isNumber(cpuUsage[key])));
      }

      const memoryUsage = data.memoryUsage;
      Object.keys(memoryUsage).forEach((key) => {
        const v = memoryUsage[key];
        assert(util.isNumber(v));
        assert.equal(parseInt(v, 10), v);
      });
      done();
      clearInterval(timer);
    }, 'MB', 10);
  });

  it('set heap unit 0.00GB success', (done) => {
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
          assert.notEqual(parseInt(v, 10), v);
        }
      });
      done();
      clearInterval(timer);
    }, '0.000GB', 10);
  });

  it('set camelCase success', (done) => {
    performance.camelCase = true;
    const timer = performance((data) => {
      assert(data.heap.totalHeapSize);
      done();
      clearInterval(timer);
    }, 10);
  });

  it('set flatten success', (done) => {
    performance.camelCase = true;
    performance.flatten = true;
    const timer = performance((data) => {
      assert(data.memoryUsageRss);
      done();
      clearInterval(timer);
    }, 10);
  });

  it('no callback', (done) => {
    const timer = performance(10);
    setTimeout(() => {
      clearInterval(timer);
      done();
    }, 200);
  });
});
