import {$dom} from "./dom";
import {filterStringArgs, isElement, warn} from "./_utilities";
import is from 'is_js';
import variables from "../variables";

export const $events = (function() {

	const
		localAPIs = {},
		processEventTypes = (types, callback) => filterStringArgs(types).forEach(type => callback(type))
	;

	let
		resizeTimout,
		eventDelegateHandler = function (event) {
			const {target, type} = event;

			if (!this.processedEvents[type]) return;

			this.processedEvents[type].forEach(listener => {

				const {selector, callback} = listener;

				if (!this.shouldDelegateRun(target, selector)) return;

				let returned = null;

				if (this.exceptionElement(selector)) {
					if (selector === '*') {
						returned = $dom.getAll('*')
					} else if (selector === 'document' || selector === document) {
						returned = document
					} else if (selector === 'window' || selector === window) {
						returned = window
					} else if (selector === 'html' || selector === document.documentElement || selector === 'document.documentElement') {
						returned = document.documentElement
					}
				} else {
					returned = isElement(selector) ? selector : target.closest(selector);
				}

				callback.call(returned, event);

			});
		}
	;

	localAPIs.add = function(types, target, callback, options = {}) {

		const defaults = {once: false};

		processEventTypes(types, type => {
			$dom.callAll(target, element => {
				element.addEventListener(type, callback, Object.assign(defaults, options))
			})
		});

		return this;
	};

	localAPIs.remove = function(types, target, callback) {
		processEventTypes(types, type => {
			$dom.callAll(target, element => element.removeEventListener(type, callback))
		});

		return this;
	};

	localAPIs.emit = function (type, detail = {}, element = window,) {
		if (!type) return;

		const event = new CustomEvent(type, {
			bubbles: true,
			cancelable: true,
			detail
		});

		element.dispatchEvent(event);

		return this;
	};

	localAPIs.delegate = {
		processedEvents: {},

		isBubbleEvent: type => {
			return ![
				'blur',
				'error',
				'focus',
				'mouseenter',
				'mouseleave',
				'scroll'
			].includes(type)
		},
		exceptionElement: selector => {
			return [
				'*',
				'window',
				'document',
				'document.documentElement',
				window,
				document,
				document.documentElement
			].indexOf(selector) > -1
		},
		shouldDelegateRun(target, selector) {

			if (this.exceptionElement(selector)) return true;

			if (typeof selector !== 'string' && isElement(selector) && selector.contains) {
				return selector === target || selector.contains(target);
			}

			return isElement(target) ? target.closest(selector) : false;
		},
		getDelegateEventIndex(arr, selector, callback) {
			for (let i = 0; i < arr.length; i++) {
				if (
					arr[i].selector === selector &&
					arr[i].callback.toString() === callback.toString()
				) return i;
			}
			return -1;
		},
		processEventSetup(type, selector, callback) {
			if (!this.processedEvents[type]) {
				this.processedEvents[type] = [];
				window.addEventListener(type, eventDelegateHandler, true);
			}

			this.processedEvents[type].push({selector,	callback});

		},
		on(types, selector, callback) {
			processEventTypes(types, type => {
				if (this.isBubbleEvent(type)) {
					this.processEventSetup(type, selector, callback)
				} else {
					warn(`Warning! Event type "${type}" cannot be delegated! Please use the "add" method to not receive this notification. Method "add" was used automatically`, '$events-helper, delegate.on');
					localAPIs.add(type, selector, callback)
				}
			});

			return this
		},
		off(types, selector, callback) {
			processEventTypes(types, type => {
				if (!this.processedEvents[type]) return;

				if (this.processedEvents[type].length === 1) {
					delete this.processedEvents[type];
					window.removeEventListener(type, eventDelegateHandler, true);
					return;
				}

				const eventIndex = this.getDelegateEventIndex(this.processedEvents[type], selector, callback);

				if (eventIndex < 0) return;
				this.processedEvents[type].splice(eventIndex, 1);
			});
			return this
		},
		once(types, selector, callback) {
			localAPIs.delegate.on(types, selector, function temp (event) {

				const {target} = event;

				let returnedSelf = isElement(selector) ? selector : target.closest(selector);

				callback.call(returnedSelf, event, returnedSelf);

				localAPIs.delegate.off(types, selector, temp);
			});

			return this
		},
		get list() {
			let obj = {};

			for (let type in this.processedEvents) {
				if (this.processedEvents.hasOwnProperty(type)) {
					obj[type] = this.processedEvents[type];
				}
			}

			return obj;
		}
	};

	eventDelegateHandler = eventDelegateHandler.bind(localAPIs.delegate);

	localAPIs.delegate.on(is.mobile() ? 'orientationchange' : 'resize', window, event => {

		clearTimeout(resizeTimout);

		resizeTimout = setTimeout(() => {
			localAPIs.emit(variables.customEventNames.resize, {
				originalEvent: event
			}, document.body)
		}, variables.resizeDebounce);

	});

	localAPIs.resize = (action, callback) => {
		action = action.trim();
		if (action === 'on' || action === 'off') {
			localAPIs.delegate[action](variables.customEventNames.resize, document.body, callback)
		} else {
			warn('Action for resize-callback not specified or specified incorrectly', '$events-helper')
		}
	};

	return localAPIs
})();
