import {$dom} from "./dom";
import {filterStringArgs, isElement, warn} from "./_utilities";
import is from 'is_js';
import variables from "../variables";

export const $events = (function() {

	const
		localAPIs = {},
		isTouch = is.touchDevice(),
		mouseEvents = ['click', 'dblclick'],
		touchEvents = ['tap', 'dbltap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'longtap'],
		processEventTypes = (types, callback) => filterStringArgs(types).forEach(type => callback(type)),
		needToExcludeEventByDevice = type => (isTouch && mouseEvents.includes(type)) || (!isTouch && touchEvents.includes(type)),
		createTouch = (() => {
			if (typeof document.createEvent !== 'function') return false;

			const
				defaults = {
					swipeThreshold: 100,
					tapThreshold: 150, // range of time where a tap event could be detected
					dbltapThreshold: 200, // delay needed to detect a double tap
					longtapThreshold: 1000, // delay needed to detect a long tap
					tapPrecision: 30, // touch events boundaries
				};

			let
				pointerEvent = function(type) {
					let
						lo = type.toLowerCase(),
						ms = 'MS' + type
					;
					return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false
				},
				touchEvent = name => 'on' + name in window ? name : false,
				wasTouch = false,
				tapNum = 0,
				pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer,
				touchEvents = {
					touchstart: touchEvent('touchstart') || pointerEvent('PointerDown'),
					touchend: touchEvent('touchend') || pointerEvent('PointerUp'),
					touchmove: touchEvent('touchmove') || pointerEvent('PointerMove')
				},
				isTheSameFingerId = e => !e.pointerId || typeof pointerId === 'undefined' || e.pointerId === pointerId,
				setListener = function(elm, events, callback) {
					let
						eventsArray = events.split(' '),
						i = eventsArray.length
					;

					while (i--) {
						elm.addEventListener(eventsArray[i], callback, false)
					}
				},
				getPointerEvent = function(event) {
					let hasTargetTouches = Boolean(event.targetTouches && event.targetTouches.length);

					switch (true) {
						case Boolean(event.target.touches):
							return event.target.touches[0];
						case hasTargetTouches && typeof event.targetTouches[0].pageX !== 'undefined':
							return event.targetTouches[0];
						case hasTargetTouches && Boolean(event.targetTouches[0].touches):
							return event.targetTouches[0].touches[0];
						default:
							return event
					}
				},
				isMultipleTouches = event => (event.targetTouches || event.target.touches || []).length > 1,
				getTimestamp = () => new Date().getTime(),
				sendEvent = function(elm, eventName, originalEvent, data) {
					let customEvent = document.createEvent('Event');
					customEvent.originalEvent = originalEvent;
					data = data || {};
					data.x = currX;
					data.y = currY;

					if (customEvent.initEvent) {
						for (let key in data) {
							if (data.hasOwnProperty(key)) {
								customEvent[key] = data[key]
							}
						}

						customEvent.initEvent(eventName, true, true);
						elm.dispatchEvent(customEvent)
					}

					while (elm) {
						if (elm['on' + eventName]) elm['on' + eventName](customEvent);
						elm = elm.parentNode
					}

				},
				onTouchStart = function(e) {
					if (!isTheSameFingerId(e) || isMultipleTouches(e)) return;

					pointerId = e.pointerId;

					if (e.type !== 'mousedown') wasTouch = true;

					// skip this event we don't need to track it now
					if (e.type === 'mousedown' && wasTouch) return;

					let pointer = getPointerEvent(e);

					// caching the current x
					cachedX = currX = pointer.pageX;
					// caching the current y
					cachedY = currY = pointer.pageY;

					longtapTimer = setTimeout(function() {
						sendEvent(e.target, 'longtap', e);
						target = e.target
					}, defaults.longtapThreshold);

					// we will use these variables on the touchend events
					timestamp = getTimestamp();

					tapNum++

				},
				onTouchEnd = function(e) {
					if (!isTheSameFingerId(e) || isMultipleTouches(e)) return;

					pointerId = undefined;

					// skip the mouse events if previously a touch event was dispatched
					// and reset the touch flag
					if (e.type === 'mouseup' && wasTouch) {
						wasTouch = false;
						return
					}

					let
						eventsArr = [],
						now = getTimestamp(),
						deltaY = cachedY - currY,
						deltaX = cachedX - currX
					;

					// clear the previous timer if it was set
					clearTimeout(dblTapTimer);
					// kill the long tap timer
					clearTimeout(longtapTimer);

					if (deltaX <= -defaults.swipeThreshold) eventsArr.push('swipeRight');

					if (deltaX >= defaults.swipeThreshold) eventsArr.push('swipeLeft');

					if (deltaY <= -defaults.swipeThreshold) eventsArr.push('swipeDown');

					if (deltaY >= defaults.swipeThreshold) eventsArr.push('swipeUp');

					if (eventsArr.length) {
						for (let i = 0; i < eventsArr.length; i++) {
							let eventName = eventsArr[i];
							sendEvent(e.target, eventName, e, {
								distance: {
									x: Math.abs(deltaX),
									y: Math.abs(deltaY)
								}
							})
						}
						// reset the tap counter
						tapNum = 0
					} else {

						if (
							cachedX >= currX - defaults.tapPrecision &&
							cachedX <= currX + defaults.tapPrecision &&
							cachedY >= currY - defaults.tapPrecision &&
							cachedY <= currY + defaults.tapPrecision
						) {
							if (timestamp + defaults.tapThreshold - now >= 0)
							{
								// Here you get the Tap event
								sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
								target= e.target
							}
						}

						// reset the tap counter
						dblTapTimer = setTimeout(function() {
							tapNum = 0
						}, defaults.dbltapThreshold)

					}
				},
				onTouchMove = function(e) {
					if (!isTheSameFingerId(e)) return;
					// skip the mouse move events if the touch events were previously detected
					if (e.type === 'mousemove' && wasTouch) return;

					let pointer = getPointerEvent(e);
					currX = pointer.pageX;
					currY = pointer.pageY;
				};

			setListener(document, touchEvents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart);
			setListener(document, touchEvents.touchend + (defaults.justTouchEvents ? '' : ' mouseup'), onTouchEnd);
			setListener(document, touchEvents.touchmove + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove);

			return function(options) {
				for (let opt in options) {
					if (options.hasOwnProperty(opt)) {
						defaults[opt] = options[opt]
					}
				}

				return defaults
			}
		})()
	;

	let resizeTimout;



	localAPIs.add = function(types, target, callback, options = {}) {

		const defaults = {once: false};

		processEventTypes(types, type => {
			if (!needToExcludeEventByDevice(type)) {
				$dom.callAll(target, element => {
					element.addEventListener(type, callback, Object.assign(defaults, options))
				})
			}
		});

		return this;
	};

	localAPIs.remove = function(types, target, callback) {
		processEventTypes(types, type => {
			$dom.callAll(target, element => element.removeEventListener(type, callback))
		});

		return this;
	};

	localAPIs.emit = function (type, element = window, detail = {}) {
		if (!type) return;

		const event = new CustomEvent(type, {
			bubbles: true,
			cancelable: true,
			detail
		});

		element.dispatchEvent(event);

		return this;
	};

	localAPIs.debounce = function (targetFunction) {

		let timeout;

		return function () {
			let
				context = this,
				args = arguments
			;

			if (timeout) window.cancelAnimationFrame(timeout);

			timeout = window.requestAnimationFrame(() => targetFunction.apply(context, args));
		}

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
		eventDelegateHandler(event) {

			const {target, type} = event;

			if (!this.processedEvents[type] || needToExcludeEventByDevice(type)) return;


			this.processedEvents[type].forEach(listener => {

				const {selector, callback} = listener;

				if (!this.shouldDelegateRun(target, selector, type)) return;

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

			if (!needToExcludeEventByDevice(type)) {
				if (!this.processedEvents[type]) {
					this.processedEvents[type] = [];
					window.addEventListener(type, this.eventDelegateHandler.bind(this), true);
				}
				this.processedEvents[type].push({selector,	callback});
			}

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

				if (this.processedEvents[type].length < 2 || !selector) {
					delete this.processedEvents[type];
					window.removeEventListener(type, this.eventDelegateHandler.bind(this), true);
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

	localAPIs.delegate.on(is.mobile() ? 'orientationchange' : 'resize', window, event => {

		clearTimeout(resizeTimout);

		resizeTimout = setTimeout(() => {
			localAPIs.emit(variables.customEventNames.resize, document.body, {
				originalEvent: event
			})
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

	localAPIs.touchConfigure = createTouch;

	return localAPIs

})();
