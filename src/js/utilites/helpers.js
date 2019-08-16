import {variables as $v} from '../modules/variables';

export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getBooleanAttr(attr) {
	return attr === 'true';
}
export function isIe() {
	return document.documentMode || /Edge/.test(navigator.userAgent)
}
export function createSvg(tag, attrs) {
	let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (let k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}
export function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}
export function getBottomOffset(elem) {
	return $v.$window.outerHeight() - (elem.outerHeight() + elem.offset().top)
}
export function getRightOffset(elem) {
	return $v.$window.outerWidth() - (elem.outerWidth() + elem.offset().left)
}
export const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};