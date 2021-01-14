import {$dom} from "./dom";
import {$data} from "./data";
import is from 'is_js';
import {$events} from "./events";
import {$style} from "./style";
import {$ui} from "./ui";
import ModalController from "../ui/Modal";

export default function initGlobalApi(APIName = '$API') {

	const functional = [
		{
			name: 'dom',
			value: $dom
		},
		{
			name: 'data',
			value: $data
		},
		{
			name: 'is',
			value: is
		},
		{
			name: 'events',
			value: $events
		},
		{
			name: 'style',
			value: $style
		},
		{
			name: 'ui',
			value: $ui
		},
		{
			name: 'ModalController',
			value: new ModalController({
				overlap: true,
				onShow(modal) {
					//console.log('--------------');
					//console.log('show');
					//console.log('activeModal', this.activeModal);
					//console.log('opened', this.opened);
					//console.log('--------------')
				},
				onClose(modal) {
					//console.log('--------------');
					//console.log('close');
					//console.log('activeModal', this.activeModal);
					//console.log('opened', this.opened);
					//console.log('--------------')
				}
			})
		}
	];

	if (Boolean(window[APIName])) {
		console.warn('No global front API created! Specify a unique API name as an argument to the initGlobalApi function as a string')
	} else {
		window[APIName] = {};

		functional.forEach(item => window[APIName][item.name] = item.value);
	}

};

export function warn(message, locationName) {
	console.warn(message + `. Warning source - ${locationName}`)
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

export function performanceTest(cb, customMessage = null) {
	const t0 = performance.now();
	cb();
	const t1 = performance.now();
	console.log(`performanceTest took ${t1 - t0} milliseconds.`);
}

export function filterStringArgs(targets) {
 	return targets.toString().split(/[\s,]+/).filter(e => e.length)
}

export function convertReturnedTarget(target) {
	return is.not.array(target) && !isElement(target) ? document.querySelector(target) : target;
}


