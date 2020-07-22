export function isIe() {
	return document.documentMode || /Edge/.test(navigator.userAgent)
}