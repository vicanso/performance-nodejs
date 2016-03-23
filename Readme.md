# performance-nodejs
  
  Get nodejs performance, eg: heap statistics, event loop delay

## Installation

```
$ npm install performance-nodejs
```

## Description

  The `performance()` function get node.js performance (include event loop and heap statistics). 

```
const timer = performance(fn, interval);
```

* fn: The callback function to execute.

* interval: Check interval, defaulted to 100ms.

Returns: A reference to the timer. Useful for clearing the timer. 


```
performance(data => {
	// {"lag":5,"heap":{"total_heap_size":61160224,"total_heap_size_executable":7340032,"total_physical_size":61160224,"total_available_size":1477373760,"used_heap_size":32845320,"heap_size_limit":1535115264}}
	console.info(JSON.stringify(data));
});
```

# License

MIT
