import variables from "../variables";
import is from "is_js";

export function warn(message, locationName) {

	if (variables.debugLogs) {
		console.warn(message + `. Warning source - ${locationName}`)
	} else {
		if (variables.debugLogsDisabledNotify) {
			console.info('%cDebug mode is disabled. You will not see any error messages from "$helpers"', 'color: orange;');
		}
	}
}

export function toDashesCase(string) {
	return  string.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

export function toCamelCase(string) {
  return string.replace( /-([a-z])/g, function( _all, letter ) {
    return letter.toUpperCase();
  });
}

export function isElement(target){
	return (
		typeof HTMLElement === 'object' ? target instanceof HTMLElement :
			target && typeof target === 'object' && target !== null && target.nodeType === 1 && typeof target.nodeName === 'string'
	);
}

export function isNode(target){
	return (
		typeof Node === "object" ? target instanceof Node :
			target && typeof target === "object" && typeof target.nodeType === "number" && typeof target.nodeName==="string"
	);
}

export function filterStringArgs(targets) {
	return targets.toString().split(/[\s,]+/).filter(e => e.length)
}

export function optimizeTarget(target) {
	return (is.not.array(target) && !isElement(target) && target !== window && target !== document)
    ? document.querySelector(target)
    : target;
}

export function preventDefault(event) {
	(event.originalEvent || event).preventDefault();
	return event;
}

export function loop(arr, cb) {
  if (is.not.array(arr) || is.not.function(cb)) return;

  for (let i = 0; i < arr.length; i++) {
    cb.call(arr[i], arr[i], i)
  }
}

export function forIn(obj, cb) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cb.call(obj[key], key, obj[key])
    }
  }
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function generateId(usePostfix = true) {

  const postfix = '--' + getRandomInt(0, 10000);

  return '_' + Math.random().toString(36).substr(2, 9) + (usePostfix ? postfix : '');
}

export function addZero(val) {
  return ('0' + val).slice(-2);
}