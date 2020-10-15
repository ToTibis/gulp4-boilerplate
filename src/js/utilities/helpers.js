import {gsap} from "gsap";
import $assist from "../utilities/Assistant";

const
	sbw = getScrollbarWidth(),
	body = $assist('body')
;

function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}
/*-----------local end------------*/

export function createSvg(tag, attrs) {
	let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (let key in attrs) el.setAttribute(key, attrs[key]);
	return el;
}
export function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}
export function blockedScroll(action) {

	switch (action) {
		case 'set':
			gsap.set(body.el, {
				overflow: 'hidden',
				paddingRight: sbw
			});
			break;
		case 'remove':
			gsap.set(body.el, {
				clearProps: 'overflow,paddingRight'
			});
			break;
		default:
			console.error('Missing argument in blockedScroll function')
	}

	return sbw;

}
export function deepMergeObject(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMergeObject(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMergeObject(target, ...sources);
}