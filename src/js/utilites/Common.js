export function domReady(cb) {
	if ( 'function' !== typeof cb ) {
		return;
	}
	if (document.readyState === 'complete' ) {
		return cb();
	}
	document.addEventListener( 'DOMContentLoaded', cb, false );
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
