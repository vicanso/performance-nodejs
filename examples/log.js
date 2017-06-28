'use strict';
const performance = require('..');

performance.camelCase = true;
performance.flatten = true;

const timer = performance(data => {
  console.info(JSON.stringify(data, null, 2));
}, 'MB', 500);
timer.ref();