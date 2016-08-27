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

  The `performance()` function get node.js performance (include event loop and heap statistics). 

```
const timer = performance(fn, interval);
```

* fn: The callback function to execute.

* interval: Check interval, defaulted to 100ms.

* unit: Set the heap format unit, eg: 'B', 'MB', 'GB', defaulted to 'B'.

Returns: A reference to the timer. Useful for clearing the timer. 


```
performance(data => {
	// {"lag":5,"heap":{"total_heap_size":61160224,"total_heap_size_executable":7340032,"total_physical_size":61160224,"total_available_size":1477373760,"used_heap_size":32845320,"heap_size_limit":1535115264}}
	console.info(JSON.stringify(data));
}, 'MB', 100);
```

# License

MIT
