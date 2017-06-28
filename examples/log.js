'use strict';
const performance = require('..');

performance.camelCase = true;

const timer = performance(data => {
  console.info(JSON.stringify(data, null, 2));
}, 'MB', 500);
timer.ref();