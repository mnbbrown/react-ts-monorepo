#!/usr/bin/env node

'use strict';
const { sync } = require('react-dev-utils/crossSpawn');
const path = require('path');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'build':
  case 'start':
  case 'test': {
    const runner = require('../src/' + script);
    runner().then((result) => {
      if (result) {
        console.log(result);
      }
      process.exit();
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    })
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    break;
}