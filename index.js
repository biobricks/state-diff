var extend = require('xtend');
var from = require('from2');

var empty = {};

function diff(o, n, opts, callback, path) {
  if(typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts = opts || {};
  path = path || [];

  var keys = {};
  var key;
  for(key in o) {
    keys[key] = true;
  }
  for(key in n) {
    keys[key] = true;
  }

  var res = false
  var oO, oN, aO, aN, newPath;
  for(key in keys) {

    newPath = path.concat([key]);

    aO = (o[key] instanceof Array);
    aN = (n[key] instanceof Array);
    oO = (typeof o[key] === 'object' && !aO);
    oN = (typeof n[key] === 'object' && !aN);

    if(oO || oN) {
      if(!oO) {
        res = res || diff({}, n[key], callback, opts, newPath);
      } else if(!oN) {
        res = res || diff(o[key], empty, callback, opts, newPath);
      } else {
        res = res || diff(o[key], n[key], callback, opts, newPath);
      }
      
    } else if(aO && aN) {
      if(opts.shallowArrays) {
        res = res || diff(o[key], n[key], callback, extend(opts, {checkOnly: true}), newPath);
        if(res) callback(newPath);
      } else {
        res = res || diff(o[key], n[key], callback, opts, newPath);
      }
    } else {

      if(((key in o) !== (key in n)) || (o[key] !== n[key])) {
        if(opts.checkOnly) return true;
        callback(newPath);
      }
    }
  }
  return res;
}

module.exports = function(o, n, opts, callback) {
  if(typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts = xtend({
    stream: true,
    shallowArrays: false
  }, opts || {});
  
  if(!opts.stream) {
    return diff(o, n, opts, callback);
  } else {
    return from.obj(function(size, next) {
      diff(o, n, opts, function(change) {
        // TODO 
        
      });
    });
  }


};
