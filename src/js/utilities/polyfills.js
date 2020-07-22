if (!Object.entries) {
  Object.entries = function( obj ){
    let ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'function' || typeof func === 'function') && this) )
      throw new TypeError();

    let len = this.length >>> 0,
      res = new Array(len),
      t = this, c = 0, i = -1;

    let kValue;
    if (thisArg === undefined){
      while (++i !== len){
        if (i in this){
          kValue = t[i];
          if (func(t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }
    else{
      while (++i !== len){
        if (i in this){
          kValue = t[i];
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }

    res.length = c;
    return res;
  };
}
