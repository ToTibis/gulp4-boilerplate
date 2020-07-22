export function createSvg(tag, attrs) {
	let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (let key in attrs) el.setAttribute(key, attrs[key]);
	return el;
}
export function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}