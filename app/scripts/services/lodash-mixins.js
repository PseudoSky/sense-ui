'use strict';

/**
 * @ngdoc service
 * @name senseUiApp.lodashMixins
 * @description
 * # lodashMixins
 * Factory in the senseUiApp.
 */
angular.module('lodashMixins',[])
  .run(function () {
      var _;
      var mixins = {};
      if (typeof require === 'function') {
        _ = require('lodash');
        module.exports = mixins;
      } else {
        _ = window._;
      }

      mixins.construct = function construct(Target, value) {
        if (typeof value !== 'undefined') {
          return new Target(value);
        } else {
          return undefined;
        }
      };

      mixins.clean = function clean(object) {
        var r = {};

        for (var key in object) {
          var value = object[key];

          if (_.isPlainObject(value)) {
            value = clean(value);
            if (_.isEmpty(value)) {
              value = undefined;
            }
          }

          if (!_.isUndefined(value)) {
            r[key] = value;
          }
        }

        return r;
      };

      mixins.set = function set(target, key, value) {
        target[key] = value;
        return target;
      };

      mixins.get = _.result;

      function flatten(obj, separator, into, prefix) {
        _.each(obj, function(v, k) {
          if (_.isPlainObject(v)) {
            flatten(obj[k], separator, into, prefix + k + separator);
          } else {
            into[prefix + k] = v;
          }
        });
        return into;
      }

      mixins.flattenObj = function(obj, separator) {
        separator = separator || '.';
        return flatten(obj, separator, {}, '');
      };

      mixins.unflattenObj = function(obj, separator) {
        separator = separator || '.';

        var r = {};
        _.each(obj, function(v, k) {
          var s = k.split(separator);
          var c = r;
          var len = s.length - 1;
          _.each(s, function(k, i) {
            c = c[k] = (i === len ? v : (c[k] || {}));
          });
        });

        return r;
      };

      _.mixin(mixins);

  _.mixin({
    // _.delegator(cases, defaultCaseKey [, thisArg])
    // Returns a function object that acts as a delegator for a method look-up object.
    // Use as a configurable replacement for switch statements.
    //
    // cases: Required. Object containing method functions.
    // defaultCaseKey: Required. Name of key containing default method function.
    //    Default case is used when no case key is provided,
    //    or when provided case key is not found in cases object.
    // thisArg: Optional. "this" argument to be used as context for case method function evaluation.
    //
    // Returned delegator function uses its first argument as the case key.
    // All other arguments passed to the delegator function
    // are passed directly through to the delegate method.
    //
    // Inspired by and substantially copied from https://github.com/rwldrn/idiomatic.js/
    delegator: function(cases, defaultCaseKey, thisArg) {
      var delegator;

      // create delegator function
      delegator = function() {
        var args, caseKey, delegate;

        // transform arguments list into an array
        args = [].slice.call(arguments);

        // shift the case key from the arguments
        caseKey = args.shift();

        // assign default delegate
        delegate = cases[defaultCaseKey];

        // derive delegate method based on caseKey
        if (caseKey && cases[caseKey]) {
          delegate = cases[caseKey];
        }

        // thisArg is undefined if not supplied
        return delegate.apply(thisArg, args);
      };

      // add delegator methods
      // getter/setter methods to access delegator initialization parameters
      delegator.cases = function(obj) {
        if (!obj) { return cases; }
        cases = obj;
      };
      delegator.defaultCaseKey = function(key) {
        if (!key) { return defaultCaseKey; }
        defaultCaseKey = key;
      };
      delegator.thisArg = function(obj) {
        if (!obj) { return thisArg; }
        thisArg = obj;
      };

      // utility methods
      delegator.extendCases = function(obj) {
        _.extend(cases, obj);
      };
      delegator.hasCase = function(key) {
        return _.isFunction(cases[key]);
      };

      return delegator;
    },

    // _.collate(array, propertyName)
    // Will organize a flat array of items into an array of grouped arrays of items
    // while maintaining the original array order.
    //
    // array: Required. The array of items to collate.
    // propertyName: Required. The propertyName on which to collate each item.
    //    propertyName argument may be a string, a number, a function,
    //    or an array of strings, numbers, and/or functions.
    //    If propertyName is a function, items will be grouped on the function return value.
    //    propertyName functions will be called with two arguemnts: item, index.
    collate: function (array, propertyName) {
      var keys = [].concat(propertyName),
        key = keys.shift(),
        result = [],
        group,
        lastValue;

      // return the array argument if key argument is null or undefined
      if (key == null) { return array; }

      // return an empty array if array argument is empty or null or undefined
      if (array == null || !array.length) { return result; }

      _.each(array, function (item, index) {
        // if item[key] does not match the last value,
        // or if this is the first item, reset the group array
        if (!(index && (_.isFunction(key) ? key(item, index) : item[key]) === lastValue)) {
          // if this is not the first item, save the current group
          // and call collate on it if there are additional keys
          if (index) { result.push(keys.length ? _.collate(group, keys) : group); }
          group = [];
        }

        // push the current item onto the current group
        group.push(item);

        // set the cached lastValue to the current item
        lastValue = (_.isFunction(key) ? key(item, index) : item[key]);
      });

      // save the final group
      // call collate on it if there are additional keys
      result.push(keys.length ? _.collate(group, keys) : group);

      return result;
    },

    // _.guid()
    // Will return a rfc4122 version 4 compliant guid string.
    // Taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    guid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    prune: function (object) {
      _.forOwn(object, function (value, key) {
        if (value === "" || (_.isPlainObject(value) && _.isEmpty(value))) {
          delete object[key];
        }
      });

      return object;
    }
  });

  _.mixin({
    //rolls an array of key/value pairs into an object
    roll: function(){
      var args = _.toArray(arguments);
      if (args.length == 1) {
        var firstItem = _.first(args);
        if (_.isArray(firstItem)){
          args = firstItem;
        } else {
          return firstItem;
        }
      }
      var object = {};
      for(var idx = 0; idx < args.length; idx += 2){
        var key = args[idx], value = args[idx + 1];
        object[key] = value;
      }
      return object;
    },
    //unrolls an object into an array of key/value pairs
    unroll: function(object){
      var array = [];
      _.each(object, function(value, key){
        array.push(key); array.push(value);
      });
      return array;
    }
  });
  _.mixin({toObject: _.prototype.roll}); //a possible alias
// underscore addon with sum, mean, median and nrange function
// see details below

_.mixin({

  // Return sum of the elements
  sum : function(obj, iterator, context) {
    if (!iterator && _.isEmpty(obj)) return 0;
    var result = 0;
    if (!iterator && _.isArray(obj)){
      for(var i=obj.length-1;i>-1;i-=1){
        result += obj[i];
      };
      return result;
    };
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      result += computed;
    });
    return result;
  },

  // Return aritmethic mean of the elements
  // if an iterator function is given, it is applied before
  mean : function(obj, iterator, context) {
    if (!iterator && _.isEmpty(obj)) return Infinity;
    if (!iterator && _.isArray(obj)) return _.sum(obj)/obj.length;
    if (_.isArray(obj) && !_.isEmpty(obj)) return _.sum(obj, iterator, context)/obj.length;
  },

  // Return median of the elements
  // if the object element number is odd the median is the
  // object in the "middle" of a sorted array
  // in case of an even number, the arithmetic mean of the two elements
  // in the middle (in case of characters or strings: obj[n/2-1] ) is returned.
  // if an iterator function is provided, it is applied before
  median : function(obj, iterator, context) {
    if (_.isEmpty(obj)) return Infinity;
    var tmpObj = [];
    if (!iterator && _.isArray(obj)){
      tmpObj = _.clone(obj);
      tmpObj.sort(function(f,s){return f-s;});
    }else{
      _.isArray(obj) && each(obj, function(value, index, list) {
        tmpObj.push(iterator ? iterator.call(context, value, index, list) : value);
        tmpObj.sort();
      });
    };
    return tmpObj.length%2 ? tmpObj[Math.floor(tmpObj.length/2)] : (_.isNumber(tmpObj[tmpObj.length/2-1]) && _.isNumber(tmpObj[tmpObj.length/2])) ? (tmpObj[tmpObj.length/2-1]+tmpObj[tmpObj.length/2]) /2 : tmpObj[tmpObj.length/2-1];
  },

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  // replacement of old _.range() faster + incl. convenience operations:
  //    _.nrange(start, stop) will automatically set step to +1/-1
  //    _.nrange(+/- stop) will automatically start = 0 and set step to +1/-1
  nrange : function(start, stop, step) {
    if (arguments.length <= 1) {
      if (start === 0)
        return [];
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1*(start < stop) || -1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    do {
      range[idx] = start;
      start += step;
    } while((idx += 1) < len);

    return range;
  }

});
_.mixin({ mapValues: function (obj, f_val) {
  return _.object(_.keys(obj), _.map(obj, f_val));
}});
_.mixin({ pairsToObj:function(keys,vals){
  _(vals).map(function(d){return _.zipObject(keys,d)}).value()},
  log:function(){console.log(arguments);}

})
_.mixin({

 // Return a copy of an object containing all but the blacklisted properties.
  unpick: function (obj) {
    obj || (obj = {});
    return _.pick(obj, _.difference(_.keys(obj), _.flatten(Array.prototype.slice.call(arguments, 1))));
  }

});
  });


