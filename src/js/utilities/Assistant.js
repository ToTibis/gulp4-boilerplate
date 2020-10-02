import './polyfills';

const debugMode = true;

if (debugMode) {
	console.info('%cAssistant debug mode on, to disable it look for 3 line in Assistant.js', 'color: #43a047 ')
}

class Assistant {
	constructor(selector, parent, debug = debugMode) {

		this.selector = selector;

		try {

			if (parent instanceof Element) {
				this.parent = parent
			} else if(typeof parent === 'string') {
				this.parent = document.querySelector(parent);
			} else if(parent === undefined) {
				this.parent = document
			}

			switch (typeof this.selector) {
				case 'object':
					this.els = ( this.selector[0] && this.selector[0] instanceof Element ) ? this.selector : [ this.selector ];
					break;
				case 'string':
					this.els = this.parent.querySelectorAll( this.selector );
					break;
			}

			this.els = [].slice.call( this.els );

			Object.defineProperty(this, 'el', {
				get() {
					return this.els[0]
				}
			});
			Object.defineProperty(this, 'exist', {
				get() {
					return this.els.length > 0
				}
			});

			if (debug) {
				if (!this.exist) {
					console.warn(`%cElements by selector ${selector} not found`, 'padding: 5px 10px;');
				}
			}

		}
		catch (e) {
			console.warn(`%cAn error occurred while creating the Assistant class. \nSelector: ${selector};\nParent: ${parent};`, 'padding: 5px 10px;');
			this.els = null;
		}
	}

	_cssPropertyToCamelCase(string) {
		return string.replace( /-([a-z])/g, function( _all, letter ) {
			return letter.toUpperCase();
		} );
	}


	each(cb) {
		Array.prototype.forEach.call(this.els, function(el, index){
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

	toggleClass(className) {
		this.each( el => {
			el.classList.toggle(className)
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
			el = this.els[0],
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
				el.style[this._cssPropertyToCamelCase(property)] = value
			});
		}

		if (typeof value === 'undefined') {

			return styles[property]

		}

		return  this;

	}

	getParent(s) {

		let el = this.els[0];

		if (s !== undefined) {
			do {
				if (el.matches(s)) return new Assistant(el);
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);

		} else {
			return el.parentNode
		}


	}

	not(exception) {

		const target = typeof exception === 'string' ? this.parent.querySelector(exception) : exception;

		return new Assistant(

			this.els.filter(elem => {
				return elem !== target
			})

		)

	}

	offset() {

		let rect = 	this.els[0].getBoundingClientRect();

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

	get(index) {
		return this.els[index]
	}

	on(event, listener, capture = false) {
		this.eventsHandler( addEventListener, event, listener, capture );
		return this;
	}

	off(event, listener, capture = false) {
		this.eventsHandler( removeEventListener, event, listener, capture );
	}

}

export default function $assist(selector, parent) {
	return new Assistant(selector, parent)
}