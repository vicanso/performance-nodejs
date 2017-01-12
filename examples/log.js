'use strict';
const performance = require('..');
const timer = performance(data => {
  console.info(JSON.stringify(data, null, 2));
}, 'MB', 500);
timer.ref();
