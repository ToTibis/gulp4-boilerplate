export function domReady(cb) {
	if ( 'function' !== typeof cb ) {
		return;
	}
	if (document.readyState === 'complete' ) {
		return cb();
	}
	document.addEventListener( 'DOMContentLoaded', cb, false );

}


class Assistant {
	constructor(selector, parent = document) {

		this.selector = selector;
		this.parent = parent;
		this.el = null;

		this.init();
	}
	init() {

		switch (typeof this.selector) {
			case 'object':
				this.el = ( this.selector[0] && this.selector[0] instanceof Element ) ? this.selector : [ this.selector ];
				break;
			case 'string':


				this.el = this.parent.querySelectorAll( this.selector );
				break;
		}

		this.el = [].slice.call( this.el );

		return this;
	}

}

export function $assist(selector, parent = document) {
	return new Assistant(selector, parent)
}