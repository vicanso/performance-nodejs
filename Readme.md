# performance-nodejs


[![Build Status](https://travis-ci.org/vicanso/performance-nodejs.svg?style=flat-square)](https://travis-ci.org/vicanso/performance-nodejs)
[![Coverage Status](https://img.shields.io/coveralls/vicanso/performance-nodejs/master.svg?style=flat)](https://coveralls.io/r/vicanso/performance-nodejs?branch=master)
[![npm](http://img.shields.io/npm/v/performance-nodejs.svg?style=flat-square)](https://www.npmjs.org/package/performance-nodejs)
[![Github Releases](https://img.shields.io/npm/dm/performance-nodejs.svg?style=flat-square)](https://github.com/vicanso/performance-nodejs)

  Get nodejs performance, such as: heap statistics, event loop delay

## Installation

```
$ npm i performance-nodejs
```

## Examples

View the [./examples](examples) directory for working examples.


## Description

  The `performance()` function get node.js performance (include event loop, heap statistics and heap space statistics).

  * If node.js support v8.getHeapSpaceStatistics(), the heap space will be return.

```
const timer = performance(fn, interval);
```

* fn: The callback function to execute.

* interval: Check interval, defaulted to 100ms.

* unit: Set the heap format unit, eg: 'B', 'MB', 'GB', '0.0MB' defaulted to 'B'. `0.00MB` means set 2 precision and 'MB' unit.

Returns: A reference to the timer. Useful for clearing the timer.


`cpuUsage` is new in node.js v6.x.

`malloced_memory`, `peak_malloced_memory` and `does_zap_garbage` is new in node.js v7.x

```json
// node.js performance
{
  "lag": 0,
  "heap": {
    "total_heap_size": 7,
    "total_heap_size_executable": 5,
    "total_physical_size": 7,
    "total_available_size": 1421,
    "used_heap_size": 3,
    "heap_size_limit": 1432,
    "malloced_memory": 0,
    "peak_malloced_memory": 1,
    "does_zap_garbage": 0
  },
  "heapSpace": {
    "new_space": {
      "size": 2,
      "used_size": 1,
      "available_size": 0,
      "physical_size": 2
    },
    "old_space": {
      "size": 2,
      "used_size": 1,
      "available_size": 0,
      "physical_size": 2
    },
    "code_space": {
      "size": 2,
      "used_size": 1,
      "available_size": 0,
      "physical_size": 2
    },
    "map_space": {
      "size": 1,
      "used_size": 0,
      "available_size": 0,
      "physical_size": 1
    },
    "large_object_space": {
      "size": 0,
      "used_size": 0,
      "available_size": 1421,
      "physical_size": 0
    }
  },
  "cpuUsage": {
    "user": 1966,
    "system": 185,
    "usedPercent": 1,
    "total": 474737
  },
  "memoryUsage": {
    "rss": 20,
    "heapTotal": 5,
    "heapUsed": 4,
    "external": 0
  }
}
```

```
performance(data => {
	console.info(JSON.stringify(data));
}, 'MB', 100);
```

# License

MIT
