import merge from 'deepmerge';

export const $data = (function () {

  const localAPIs = {};

  localAPIs.merge = merge;

  localAPIs.cloneObject = obj => JSON.parse(JSON.stringify(obj));

  return localAPIs;

})();
