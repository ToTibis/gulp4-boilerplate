export function domReady(cb) {
	if ( 'function' !== typeof cb ) {
		return;
	}
	if (document.readyState === 'complete' ) {
		return cb();
	}
	document.addEventListener( 'DOMContentLoaded', cb, false );
}