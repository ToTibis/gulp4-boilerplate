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
	return is.not.array(target) && !isElement(target) && target !== window ? document.querySelector(target) : target;
}

export function preventDefault(event) {
	(event.originalEvent || event).preventDefault();
	return event;
}

export function sleep(ms) {
	let tm = null;
	return new Promise(resolve => {
		tm = setTimeout(resolve, ms);
	}).then(() => {
		clearTimeout(tm);
		tm = null;
	});
}
