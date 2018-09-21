(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MicroModal = factory());
}(this, (function () { 'use strict';

	var version = "0.3.1";

	var classCallCheck = function (instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	};

	var createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var toConsumableArray = function (arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

				return arr2;
		} else {
			return Array.from(arr);
		}
	};

	var MicroModal = function () {

		var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

		var Modal = function () {
			function Modal(_ref) {
				var targetModal = _ref.targetModal,
				_ref$triggers = _ref.triggers,
				triggers = _ref$triggers === undefined ? [] : _ref$triggers,
				_ref$onShow = _ref.onShow,
				onShow = _ref$onShow === undefined ? function () {} : _ref$onShow,
				_ref$onClose = _ref.onClose,
				onClose = _ref$onClose === undefined ? function () {} : _ref$onClose,
				_ref$openTrigger = _ref.openTrigger,
				openTrigger = _ref$openTrigger === undefined ? 'data-micromodal-trigger' : _ref$openTrigger,
				_ref$closeTrigger = _ref.closeTrigger,
				closeTrigger = _ref$closeTrigger === undefined ? 'data-micromodal-close' : _ref$closeTrigger,
				_ref$disableScroll = _ref.disableScroll,
				disableScroll = _ref$disableScroll === undefined ? false : _ref$disableScroll,
				_ref$disableFocus = _ref.disableFocus,
				disableFocus = _ref$disableFocus === undefined ? false : _ref$disableFocus,
				_ref$awaitCloseAnimat = _ref.awaitCloseAnimation,
				awaitCloseAnimation = _ref$awaitCloseAnimat === undefined ? false : _ref$awaitCloseAnimat,
				_ref$debugMode = _ref.debugMode,
				debugMode = _ref$debugMode === undefined ? false : _ref$debugMode;
				classCallCheck(this, Modal);

				this.modal = document.getElementById(targetModal);

				this.config = { debugMode: debugMode, disableScroll: disableScroll, openTrigger: openTrigger, closeTrigger: closeTrigger, onShow: onShow, onClose: onClose, awaitCloseAnimation: awaitCloseAnimation, disableFocus: disableFocus

				};if (triggers.length > 0) this.registerTriggers.apply(this, toConsumableArray(triggers));

				this.onClick = this.onClick.bind(this);
				this.onKeydown = this.onKeydown.bind(this);
			}

			createClass(Modal, [{
				key: 'registerTriggers',
				value: function registerTriggers() {
					var _this = this;

					for (var _len = arguments.length, triggers = Array(_len), _key = 0; _key < _len; _key++) {
						triggers[_key] = arguments[_key];
					}

					triggers.forEach(function (trigger) {
						trigger.addEventListener('click', function () {
							return _this.showModal();
						});
					});
				}
			}, {
				key: 'showModal',
				value: function showModal() {
					this.activeElement = document.activeElement;
					this.modal.setAttribute('aria-hidden', 'false');
					this.modal.classList.add('is-open');
					this.setFocusToFirstNode();
					this.scrollBehaviour('disable');
					this.addEventListeners();
					this.config.onShow(this.modal);
				}
			}, {
				key: 'closeModal',
				value: function closeModal() {
					var modal = this.modal;
					this.modal.setAttribute('aria-hidden', 'true');
					this.removeEventListeners();
					this.scrollBehaviour('enable');
					this.activeElement.focus();
					this.config.onClose(this.modal);

					if (this.config.awaitCloseAnimation) {
						this.modal.addEventListener('animationend', function handler() {
							modal.classList.remove('is-open');
							modal.removeEventListener('animationend', handler, false);
						}, false);
					} else {
						modal.classList.remove('is-open');
					}
				}
			}, {
				key: 'scrollBehaviour',
				value: function scrollBehaviour(toggle) {
					if (!this.config.disableScroll) return;
					var body = document.querySelector('body');
					switch (toggle) {
						case 'enable':
						Object.assign(body.style, { overflow: '', height: '' });
						break;
						case 'disable':
						Object.assign(body.style, { overflow: 'hidden', height: '100vh' });
						break;
						default:
					}
				}
			}, {
				key: 'addEventListeners',
				value: function addEventListeners() {
					this.modal.addEventListener('touchstart', this.onClick);
					this.modal.addEventListener('click', this.onClick);
					document.addEventListener('keydown', this.onKeydown);
				}
			}, {
				key: 'removeEventListeners',
				value: function removeEventListeners() {
					this.modal.removeEventListener('touchstart', this.onClick);
					this.modal.removeEventListener('click', this.onClick);
					document.removeEventListener('keydown', this.onKeydown);
				}
			}, {
				key: 'onClick',
				value: function onClick(event) {
					if (event.target.hasAttribute(this.config.closeTrigger)) {
						this.closeModal();
						event.preventDefault();
					}
				}
			}, {
				key: 'onKeydown',
				value: function onKeydown(event) {
					if (event.keyCode === 27) this.closeModal(event);
					if (event.keyCode === 9) this.maintainFocus(event);
				}
			}, {
				key: 'getFocusableNodes',
				value: function getFocusableNodes() {
					var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
					return Object.keys(nodes).map(function (key) {
						return nodes[key];
					});
				}
			}, {
				key: 'setFocusToFirstNode',
				value: function setFocusToFirstNode() {
					if (this.config.disableFocus) return;
					var focusableNodes = this.getFocusableNodes();
					if (focusableNodes.length) focusableNodes[0].focus();
				}
			}, {
				key: 'maintainFocus',
				value: function maintainFocus(event) {
					var focusableNodes = this.getFocusableNodes();

        // if disableFocus is true
        if (!this.modal.contains(document.activeElement)) {
        	focusableNodes[0].focus();
        } else {
        	var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

        	if (event.shiftKey && focusedItemIndex === 0) {
        		focusableNodes[focusableNodes.length - 1].focus();
        		event.preventDefault();
        	}

        	if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
        		focusableNodes[0].focus();
        		event.preventDefault();
        	}
        }
      }
    }]);
			return Modal;
		}();

		var activeModal = null;

		var generateTriggerMap = function generateTriggerMap(triggers, triggerAttr) {
			var triggerMap = [];

			triggers.forEach(function (trigger) {
				var targetModal = trigger.attributes[triggerAttr].value;
				if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
				triggerMap[targetModal].push(trigger);
			});

			return triggerMap;
		};

		var validateModalPresence = function validateModalPresence(id) {
			if (!document.getElementById(id)) {
				console.warn('MicroModal v' + version + ': \u2757Seems like you have missed %c\'' + id + '\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
				console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<div class="modal" id="' + id + '"></div>');
				return false;
			}
		};

		var validateTriggerPresence = function validateTriggerPresence(triggers) {
			if (triggers.length <= 0) {
				console.warn('MicroModal v' + version + ': \u2757Please specify at least one %c\'micromodal-trigger\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
				console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<a href="#" data-micromodal-trigger="my-modal"></a>');
				return false;
			}
		};

		var validateArgs = function validateArgs(triggers, triggerMap) {
			validateTriggerPresence(triggers);
			if (!triggerMap) return true;
			for (var id in triggerMap) {
				validateModalPresence(id);
			}return true;
		};

		var init = function init(config) {
			var options = Object.assign({}, { openTrigger: 'data-micromodal-trigger' }, config);
			var triggers = [].concat(toConsumableArray(document.querySelectorAll('[' + options.openTrigger + ']')));
			var triggerMap = generateTriggerMap(triggers, options.openTrigger);
			if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return;
			for (var key in triggerMap) {
				var value = triggerMap[key];
				options.targetModal = key;
				options.triggers = [].concat(toConsumableArray(value));
				new Modal(options);
			}
		};

		var show = function show(targetModal, config) {
			var options = config || {};
			options.targetModal = targetModal;
			if (options.debugMode === true && validateModalPresence(targetModal) === false) return;
			activeModal = new Modal(options);
			activeModal.showModal();
		};
		var close = function close() {
			activeModal.closeModal();
		};

		return { init: init, show: show, close: close };
	}();

	return MicroModal;

})));


if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target, firstSource) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}
if (!Array.from) {
	Array.from = (function() {
		var toStr = Object.prototype.toString;
		var isCallable = function(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		return function from(arrayLike) {
			var C = this;
			var items = Object(arrayLike);
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}
			var len = toLength(items.length);
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			var k = 0;
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		};
	}());
}