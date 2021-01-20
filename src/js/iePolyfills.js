(function(self) {
	'use strict';

	if (self.WeakMap) {
		return;
	}

	let hasOwnProperty = Object.prototype.hasOwnProperty;
	let defineProperty = function(object, name, value) {
		if (Object.defineProperty) {
			Object.defineProperty(object, name, {
				configurable: true,
				writable: true,
				value: value
			});
		} else {
			object[name] = value;
		}
	};

	self.WeakMap = (function() {

		function WeakMap() {
			if (this === void 0) {
				throw new TypeError("Constructor WeakMap requires 'new'");
			}

			defineProperty(this, '_id', genId('_WeakMap'));

			if (arguments.length > 0) {
				throw new TypeError('WeakMap iterable is not supported');
			}
		}

		defineProperty(WeakMap.prototype, 'delete', function(key) {
			checkInstance(this, 'delete');

			if (!isObject(key)) {
				return false;
			}

			let entry = key[this._id];
			if (entry && entry[0] === key) {
				delete key[this._id];
				return true;
			}

			return false;
		});

		defineProperty(WeakMap.prototype, 'get', function(key) {
			checkInstance(this, 'get');

			if (!isObject(key)) {
				return void 0;
			}

			let entry = key[this._id];
			if (entry && entry[0] === key) {
				return entry[1];
			}

			return void 0;
		});

		defineProperty(WeakMap.prototype, 'has', function(key) {
			checkInstance(this, 'has');

			if (!isObject(key)) {
				return false;
			}

			let entry = key[this._id];

			return !!(entry && entry[0] === key);
		});

		defineProperty(WeakMap.prototype, 'set', function(key, value) {
			checkInstance(this, 'set');

			if (!isObject(key)) {
				throw new TypeError('Invalid value used as weak map key');
			}

			let entry = key[this._id];
			if (entry && entry[0] === key) {
				entry[1] = value;
				return this;
			}

			defineProperty(key, this._id, [key, value]);
			return this;
		});


		function checkInstance(x, methodName) {
			if (!isObject(x) || !hasOwnProperty.call(x, '_id')) {
				throw new TypeError(
					methodName + ' method called on incompatible receiver ' +
					typeof x
				);
			}
		}

		function genId(prefix) {
			return prefix + '_' + rand() + '.' + rand();
		}

		function rand() {
			return Math.random().toString().substring(2);
		}


		defineProperty(WeakMap, '_polyfill', true);
		return WeakMap;
	})();


	function isObject(x) {
		return Object(x) === x;
	}

})(
	typeof self !== 'undefined' ? self :
		typeof window !== 'undefined' ? window :
			typeof global !== 'undefined' ? global : this
);
/*------------------------Weakmap------------------------*/

if (!Object.entries) {
	Object.entries = obj => {
		let ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i)
		;
		while (i--) {
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		}
		return resArray;
	};
}
/*---------------------Object entries---------------------*/

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
/*---------------------Element matches---------------------*/

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		let el = this;

		do {
			if (Element.prototype.matches.call(el, s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}
/*---------------------Element closest---------------------*/

if (!Array.prototype.includes) {
	Array.prototype.includes = function(search, start) {
		'use strict';
		if (search instanceof RegExp) {
			throw TypeError('first argument must not be a RegExp');
		}
		if (start === undefined) { start = 0; }
		return this.indexOf(search, start) !== -1;
	};
}
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
/*---------------------Array and String includes---------------------*/

if (typeof Object.assign !== 'function') {

	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			'use strict';
			if (target === null || target === undefined) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			let to = Object(target);

			for (let index = 1; index < arguments.length; index++) {
				let nextSource = arguments[index];

				if (nextSource !== null && nextSource !== undefined) {
					for (let nextKey in nextSource) {
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}
/*---------------------Object assign---------------------*/

(function () {

	if ( typeof window.CustomEvent === "function" ) return false;

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: null };
		let evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	window.CustomEvent = CustomEvent;
})(window);
/*---------------------Window CustomEvent---------------------*/

(function () {
	function finallyConstructor(callback) {
		let constructor = this.constructor;
		return this.then(
			function(value) {
				return constructor.resolve(callback()).then(function() {
					return value;
				});
			},
			function(reason) {
				return constructor.resolve(callback()).then(function() {
					return constructor.reject(reason);
				});
			}
		);
	}
	let setTimeoutFunc = setTimeout;

	function isArray(x) {
		return Boolean(x && typeof x.length !== 'undefined');
	}

	function noop() {}

	function bind(fn, thisArg) {
		return function() {
			fn.apply(thisArg, arguments);
		};
	}

	function Promise(fn) {
		if (!(this instanceof Promise))
			throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function') throw new TypeError('not a function');
		this._state = 0;
		this._handled = false;
		this._value = undefined;
		this._deferreds = [];

		doResolve(fn, this);
	}

	function handle(self, deferred) {
		while (self._state === 3) {
			self = self._value;
		}
		if (self._state === 0) {
			self._deferreds.push(deferred);
			return;
		}
		self._handled = true;
		Promise._immediateFn(function() {
			let cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
			if (cb === null) {
				(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
				return;
			}
			let ret;
			try {
				ret = cb(self._value);
			} catch (e) {
				reject(deferred.promise, e);
				return;
			}
			resolve(deferred.promise, ret);
		});
	}

	function resolve(self, newValue) {
		try {

			if (newValue === self)
				throw new TypeError('A promise cannot be resolved with itself.');
			if (
				newValue &&
				(typeof newValue === 'object' || typeof newValue === 'function')
			) {
				let then = newValue.then;
				if (newValue instanceof Promise) {
					self._state = 3;
					self._value = newValue;
					finale(self);
					return;
				} else if (typeof then === 'function') {
					doResolve(bind(then, newValue), self);
					return;
				}
			}
			self._state = 1;
			self._value = newValue;
			finale(self);
		} catch (e) {
			reject(self, e);
		}
	}

	function reject(self, newValue) {
		self._state = 2;
		self._value = newValue;
		finale(self);
	}

	function finale(self) {
		if (self._state === 2 && self._deferreds.length === 0) {
			Promise._immediateFn(function() {
				if (!self._handled) {
					Promise._unhandledRejectionFn(self._value);
				}
			});
		}

		for (let i = 0, len = self._deferreds.length; i < len; i++) {
			handle(self, self._deferreds[i]);
		}
		self._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.promise = promise;
	}

	function doResolve(fn, self) {
		let done = false;
		try {
			fn(
				function(value) {
					if (done) return;
					done = true;
					resolve(self, value);
				},
				function(reason) {
					if (done) return;
					done = true;
					reject(self, reason);
				}
			);
		} catch (ex) {
			if (done) return;
			done = true;
			reject(self, ex);
		}
	}

	Promise.prototype['catch'] = function(onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function(onFulfilled, onRejected) {
		let prom = new this.constructor(noop);

		handle(this, new Handler(onFulfilled, onRejected, prom));
		return prom;
	};

	Promise.prototype['finally'] = finallyConstructor;

	Promise.all = function(arr) {
		return new Promise(function(resolve, reject) {
			if (!isArray(arr)) {
				return reject(new TypeError('Promise.all accepts an array'));
			}

			let args = Array.prototype.slice.call(arr);
			if (args.length === 0) return resolve([]);
			let remaining = args.length;

			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						let then = val.then;
						if (typeof then === 'function') {
							then.call(
								val,
								function(val) {
									res(i, val);
								},
								reject
							);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}

			for (let i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function(value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}

		return new Promise(function(resolve) {
			resolve(value);
		});
	};

	Promise.reject = function(value) {
		return new Promise(function(resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function(arr) {
		return new Promise(function(resolve, reject) {
			if (!isArray(arr)) {
				return reject(new TypeError('Promise.race accepts an array'));
			}

			for (let i = 0, len = arr.length; i < len; i++) {
				Promise.resolve(arr[i]).then(resolve, reject);
			}
		});
	};

	Promise._immediateFn =
		(typeof setImmediate === 'function' &&
			function(fn) {
				setImmediate(fn);
			}) ||
		function(fn) {
			setTimeoutFunc(fn, 0);
		};

	Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
		if (typeof console !== 'undefined' && console) {
			console.warn('Possible Unhandled Promise Rejection:', err);
		}
	};

	let globalNS = (function() {
		if (typeof self !== 'undefined') {
			return self;
		}
		if (typeof window !== 'undefined') {
			return window;
		}
		if (typeof global !== 'undefined') {
			return global;
		}
		throw new Error('unable to locate global object');
	})();

	if (!('Promise' in globalNS)) {
		globalNS['Promise'] = Promise;
	} else if (!globalNS.Promise.prototype['finally']) {
		globalNS.Promise.prototype['finally'] = finallyConstructor;
	}
})(window);
/*---------------------Promise---------------------*/

(function (){
	let passiveSupported = false;
	let onceSupported = false;
	function noop() {}
	try {
		let options = Object.create({}, {
			passive: {get: function() { passiveSupported = true }},
			once: {get: function() { onceSupported = true }},
		});
		window.addEventListener('test', noop, options)
		window.removeEventListener('test', noop, options)
	} catch (e) { /* */ }

	let enhance = module.exports = function enhance(proto) {
		let originalAddEventListener = proto.addEventListener;
		let originalRemoveEventListener = proto.removeEventListener;

		let listeners = new WeakMap();
		proto.addEventListener = function(name, originalCallback, optionsOrCapture) {
			if (
				optionsOrCapture === undefined ||
				optionsOrCapture === true ||
				optionsOrCapture === false ||
				(!originalCallback || typeof originalCallback !== 'function' && typeof originalCallback !== 'object')
			) {
				return originalAddEventListener.call(this, name, originalCallback, optionsOrCapture)
			}

			let callback = typeof originalCallback !== 'function' && typeof originalCallback.handleEvent === 'function' ? originalCallback.handleEvent.bind(originalCallback) : originalCallback;
			let options = typeof optionsOrCapture === 'boolean' ? {capture: optionsOrCapture} : optionsOrCapture || {};
			let passive = Boolean(options.passive);
			let once = Boolean(options.once);
			let capture = Boolean(options.capture);
			let oldCallback = callback;

			if (!onceSupported && once) {
				callback = function(event) {
					this.removeEventListener(name, originalCallback, options);
					oldCallback.call(this, event)
				}
			}

			if (!passiveSupported && passive) {
				callback = function(event) {
					event.preventDefault = noop;
					oldCallback.call(this, event)
				}
			}

			if (!listeners.has(this)) listeners.set(this, new WeakMap());
			let elementMap = listeners.get(this);
			if (!elementMap.has(originalCallback)) elementMap.set(originalCallback, []);
			let optionsOctal = (passive * 1) + (once * 2) + (capture * 4);
			elementMap.get(originalCallback)[optionsOctal] = callback;

			originalAddEventListener.call(this, name, callback, capture)
		};

		proto.removeEventListener = function(name, originalCallback, optionsOrCapture) {
			let capture = Boolean(typeof optionsOrCapture === 'object' ? optionsOrCapture.capture : optionsOrCapture);

			let elementMap = listeners.get(this);
			if (!elementMap) return originalRemoveEventListener.call(this, name, originalCallback, optionsOrCapture);
			let callbacks = elementMap.get(originalCallback);
			if (!callbacks) return originalRemoveEventListener.call(this, name, originalCallback, optionsOrCapture);

			for (let optionsOctal in callbacks) {
				let callbackIsCapture = Boolean(optionsOctal & 4);
				if (callbackIsCapture !== capture) continue // when unbinding, capture is the only option that counts
				originalRemoveEventListener.call(this, name, callbacks[optionsOctal], callbackIsCapture)
			}

		}

	};

	if (!passiveSupported || !onceSupported) {

		if (typeof EventTarget !== 'undefined') {
			enhance(EventTarget.prototype)
		} else {
			enhance(Text.prototype);
			enhance(HTMLElement.prototype);
			enhance(Document.prototype);
			enhance(Window.prototype);
			enhance(XMLHttpRequest.prototype)
		}

	}
})(window);
/*---------------------The once and passive event listener options---------------------*/

(function (){
	if ("document" in self) {
		if (!("classList" in document.createElement("_"))
			|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

			(function (view) {

				"use strict";

				if (!('Element' in view)) return;

				let
					classListProp = "classList"
					, protoProp = "prototype"
					, elemCtrProto = view.Element[protoProp]
					, objCtr = Object
					, strTrim = String[protoProp].trim || function () {
						return this.replace(/^\s+|\s+$/g, "");
					}
					, arrIndexOf = Array[protoProp].indexOf || function (item) {
						let
							i = 0
							, len = this.length
						;
						for (; i < len; i++) {
							if (i in this && this[i] === item) {
								return i;
							}
						}
						return -1;
					}
					// Vendors: please allow content code to instantiate DOMExceptions
					, DOMEx = function (type, message) {
						this.name = type;
						this.code = DOMException[type];
						this.message = message;
					}
					, checkTokenAndGetIndex = function (classList, token) {
						if (token === "") {
							throw new DOMEx(
								"SYNTAX_ERR"
								, "An invalid or illegal string was specified"
							);
						}
						if (/\s/.test(token)) {
							throw new DOMEx(
								"INVALID_CHARACTER_ERR"
								, "String contains an invalid character"
							);
						}
						return arrIndexOf.call(classList, token);
					}
					, ClassList = function (elem) {
						let
							trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
							, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
							, i = 0
							, len = classes.length
						;
						for (; i < len; i++) {
							this.push(classes[i]);
						}
						this._updateClassName = function () {
							elem.setAttribute("class", this.toString());
						};
					}
					, classListProto = ClassList[protoProp] = []
					, classListGetter = function () {
						return new ClassList(this);
					}
				;
				// Most DOMException implementations don't allow calling DOMException's toString()
				// on non-DOMExceptions. Error's toString() is sufficient here.
				DOMEx[protoProp] = Error[protoProp];
				classListProto.item = function (i) {
					return this[i] || null;
				};
				classListProto.contains = function (token) {
					token += "";
					return checkTokenAndGetIndex(this, token) !== -1;
				};
				classListProto.add = function () {
					let
						tokens = arguments
						, i = 0
						, l = tokens.length
						, token
						, updated = false
					;
					do {
						token = tokens[i] + "";
						if (checkTokenAndGetIndex(this, token) === -1) {
							this.push(token);
							updated = true;
						}
					}
					while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.remove = function () {
					let
						tokens = arguments
						, i = 0
						, l = tokens.length
						, token
						, updated = false
						, index
					;
					do {
						token = tokens[i] + "";
						index = checkTokenAndGetIndex(this, token);
						while (index !== -1) {
							this.splice(index, 1);
							updated = true;
							index = checkTokenAndGetIndex(this, token);
						}
					}
					while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.toggle = function (token, force) {
					token += "";

					let
						result = this.contains(token)
						, method = result ?
						force !== true && "remove"
						:
						force !== false && "add"
					;

					if (method) {
						this[method](token);
					}

					if (force === true || force === false) {
						return force;
					} else {
						return !result;
					}
				};
				classListProto.toString = function () {
					return this.join(" ");
				};

				if (objCtr.defineProperty) {
					let classListPropDesc = {
						get: classListGetter
						, enumerable: true
						, configurable: true
					};
					try {
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					} catch (ex) { // IE 8 doesn't support enumerable:true
						// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
						// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
						if (ex.number === undefined || ex.number === -0x7FF5EC54) {
							classListPropDesc.enumerable = false;
							objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
						}
					}
				} else if (objCtr[protoProp].__defineGetter__) {
					elemCtrProto.__defineGetter__(classListProp, classListGetter);
				}

			}(self));

		}


	}
})(window);
/*---------------------ClassList support for Svg elements---------------------*/
