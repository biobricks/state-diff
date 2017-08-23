#!/usr/bin/env node

var diff = require('../index.js');

var state = {
  foo: {
    bar: {
      baz: ['0', '1', '2', '3']
    }
  },
  bop: 'something'
};

var newState = {
  foo: {
    bar: {
      cookiecat: true,
      baz: ['0', '1', '2', '4']
    }
  },
  lol: 'wut'
};

diff(state, newState, {shallowArrays: true}, function(path) {
  console.log("changed:", path.join('.'));
});




