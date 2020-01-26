if (!Object.entries) {
	Object.entries = function( obj ){
		let ownProps = Object.keys( obj ),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];

		return resArray;
	};
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Array.prototype.filter){
	Array.prototype.filter = function(func, thisArg) {
		'use strict';
		if ( ! ((typeof func === 'function' || typeof func === 'function') && this) )
			throw new TypeError();

		let len = this.length >>> 0,
			res = new Array(len),
			t = this, c = 0, i = -1;

		let kValue;
		if (thisArg === undefined){
			while (++i !== len){
				if (i in this){
					kValue = t[i];
					if (func(t[i], i, t)){
						res[c++] = kValue;
					}
				}
			}
		}
		else{
			while (++i !== len){
				if (i in this){
					kValue = t[i];
					if (func.call(thisArg, t[i], i, t)){
						res[c++] = kValue;
					}
				}
			}
		}

		res.length = c;
		return res;
	};
}
/*-----------------------polyfills--------------------------*/

class Assistant {
	constructor(selector, parent = document) {

		this.selector = selector;
		this.parent = parent === document ? document : document.querySelector(parent);
		this.elsArray = null;

		this.init();
	}

	init() {

		switch (typeof this.selector) {
			case 'object':
				this.elsArray = ( this.selector[0] && this.selector[0] instanceof Element ) ? this.selector : [ this.selector ];
				break;
			case 'string':


				this.elsArray = this.parent.querySelectorAll( this.selector );
				break;
		}

		this.elsArray = [].slice.call( this.elsArray );

		return this;
	}

	static _cssPropertyToCamelCase(string) {
		return string.replace( /-([a-z])/g, function( _all, letter ) {
			return letter.toUpperCase();
		} );
	}

	each(cb) {
		Array.prototype.forEach.call(this.elsArray, function(el, index){
			cb(el, index)
		});

		return this
	}

	find(selector) {

		let found = [];

		this.each(el => {

			let elFound = el.querySelectorAll(selector);

			if (elFound.length > 0) {
				found = Array.prototype.slice.call(elFound)
			}

		});
		return new Assistant(found)
	}

	addClass(className) {
		this.each( el => {
			el.classList.add(className)
		});

		return this;
	}

	removeClass(className) {
		this.each( el => {
			el.classList.remove(className)
		});

		return this;
	}

	hasClass(className) {
		let found = false;

		this.each( el => {
			if (el.classList.contains(className)) {
				found = true;
			}
		});
		return found
	}

	css(property, value) {

		const
			el = this.elsArray[0],
			styles = getComputedStyle(el)
		;

		if (typeof property === 'undefined') {

			return styles

		} else if (typeof property === 'object') {

			for (let [key, value] of Object.entries(property)) {
				this.each(el => {
					el.style[key] = value
				});
			}

			return this;
		} else {
			this.each(el => {
				el.style[Assistant._cssPropertyToCamelCase(property)] = value
			});
		}

		if (typeof value === 'undefined') {

			return styles[property]

		}

		return  this;

	}

	getParent(s) {

		let el = this.elsArray[0];

		if (s !== undefined) {
			do {
				if (el.matches(s)) return new Assistant(el);
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);
			throw new Error('missing arguments in Assistant.getParent or parent not found');
		} else {
			return el.parentNode
		}


	}

	not(exceptionSelector) {

		return new Assistant(

			this.elsArray.filter(elem => {
				return elem !== document.querySelector(exceptionSelector)
			})

		)

	}

	offset() {

		let rect = 	this.elsArray[0].getBoundingClientRect();

		return {
			left: rect.left,
			top: rect.top,
			right: window.innerWidth - (rect.width + rect.left),
			bottom: window.innerHeight - (rect.height + rect.top)
		}

	}

	wrap(tagName = 'div', attrs = {}) {

		this.each( el => {

			let wrap = document.createElement(tagName);

			for (let a in attrs) wrap.setAttribute(a, attrs[a]);

			el.parentNode.insertBefore(wrap, el);
			wrap.appendChild(el);
		});


	}

	eventsHandler(method, events, listener) {
		events.split(' ').forEach(  event  => {
			this.each(  el => {
				method.call( el, event, listener, false );
			});
		});

		return this;
	}

	on(event, listener) {
		this.eventsHandler( addEventListener, event, listener );
		return this;
	}

	off(event, listener) {
		this.eventsHandler( removeEventListener, event, listener );
	}
}

export function $assist(selector, parent = document) {
	return new Assistant(selector, parent)
}