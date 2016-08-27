'use strict';
const performance = require('..');
const timer = performance(data => {
  console.info(data);
}, 'MB', 500);
timer.ref();
