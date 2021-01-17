import {$dom} from "./dom";
import {$events} from "./events";
import {variables as $v} from "../variables";
import is from 'is_js';
import {$data} from "./data";
import {optimizeTarget, filterStringArgs} from "./_service";

export const $style = (function () {

	const
		localAPIs = {},
		{emit, add} = $events,
		{addClass, removeClass, callAll, get, each} = $dom,
		slideAnimationDuration = 500,
		cssPropertyToCamelCase = string => {
			return string.replace( /-([a-z])/g, function( _all, letter ) {
				return letter.toUpperCase();
			});
		}
	;

	localAPIs.get = function (element, property = undefined, clean = false) {

		if (!Boolean(element)) return;

		if (is.string(element)) element = get(element);

		const styles = getComputedStyle(element);

		if (is.undefined(property)) return styles;

		return clean? parseFloat(styles[property]) : styles[property]
	};

	localAPIs.set = function (target, property, value = null) {

		callAll(target, el => {
			if (is.object(property)) {
				for (let [key, value] of Object.entries(property)) el.style[key] = value
			} else if(is.string(property) && is.string(value)) {
				el.style[cssPropertyToCamelCase(property)] = value
			}
		});


		return optimizeTarget(target);
	};

	localAPIs.remove = function (target, property) {

		property = filterStringArgs(property);

		callAll(target, el => {
			$dom.each(property, prop => {
				prop = prop.trim();
				el.style.removeProperty(prop)
			})
		});

		return optimizeTarget(target)
	};

	localAPIs.animate = function(element, animationName, options = {}) {
		if (!Boolean(element) || !Boolean(animationName)) return;

		let defaults = {
			onComplete: null,
			animateInitClassName: 'animated',
			hideOnEnd: false
		};

		options = $data.deepAssign(defaults, options);

		if (is.string(element)) element = get(element);

		element.removeAttribute('hidden');

		let classes = options.animateInitClassName + ' ' + animationName;

		addClass(element, classes);

		add('animationend', element, () => {
			removeClass(element, classes);

			if (options.hideOnEnd) $dom.attr(element, 'hidden', 'true');

			if (is.function(options.onComplete)) options.onComplete(element);
			emit($v.customEventNames.animateEnd, window, {element});
		}, {
			once: true
		});



		return element;
	};

	localAPIs.animateChain = function(animationsArray, options = {}) {

		if (is.array(animationsArray) && animationsArray.length > 0) {

			let defaults = {
				onComplete: null,
				hideOnStart: true
			};

			options = $data.deepAssign(defaults, options);

			let i = 0, l = animationsArray.length, animationElements = animationsArray.map(animation => animation.element);

			if (options.hideOnStart) {
				each(animationElements, element => {
					localAPIs.set(element, {
						opacity: 0,
						visibility: 'hidden'
					})
				});
			}

			(function run(anim) {

				const {element, animationName, callback, hideOnEnd} = anim;

				if (options.hideOnStart) localAPIs.remove(element, 'opacity, visibility');

				localAPIs.animate(element, animationName,{
					onComplete() {
						i++;
						if (is.function(callback)) callback(element);

						if (i < l) {
							run(animationsArray[i])
						} else {
							if (is.not.null(options.onComplete) && is.function(options.onComplete)) options.onComplete(animationElements);
						}
					},
					hideOnEnd
				});

			})(animationsArray[0]);
		}

	};

	localAPIs.slideUp = function (target, options = {}) {

		let defaults = {
			duration: slideAnimationDuration,
			callback: null
		};

		options = Object.assign(defaults, options);

		callAll(target, el => {

			localAPIs.set(el, {
				transitionProperty: 'height, margin, padding',
				transitionDuration: options.duration + 'ms',
				boxSizing: 'border-box',
				height: el.offsetHeight + 'px',
			});

			target.offsetHeight;

			localAPIs.set(el, {
				overflow: 'hidden',
				height: 0,
				paddingTop: 0,
				paddingBottom: 0,
				marginTop: 0,
				marginBottom: 0
			});

			$events.add('transitionend', el, () => {
				localAPIs.set(el, 'display', 'none');
				localAPIs.remove(el, 'height, padding-top, padding-bottom, margin-top, margin-bottom, overflow, transition-duration, transition-property, box-sizing');

				if (is.function(options.callback)) options.callback(el);
			}, {
				once: true
			});

		})
	};

	localAPIs.slideDown = function (target, options = {}) {

		let defaults = {
			duration: slideAnimationDuration,
			callback: null
		};

		options = Object.assign(defaults, options);

		callAll(target, el => {
			localAPIs.remove(el, 'display');

			let display = window.getComputedStyle(el).display;
			if (display === 'none') display = 'block';
			localAPIs.set(el, 'display', display);
			let height = el.offsetHeight;

			localAPIs.set(el, {
				overflow: 'hidden',
				height: 0,
				paddingTop: 0,
				paddingBottom: 0,
				marginTop: 0,
				marginBottom: 0
			});

			el.offsetHeight;

			localAPIs.set(el, {
				boxSizing: 'border-box',
				transitionProperty: 'height, margin, padding',
				transitionDuration: options.duration + 'ms',
				height: height + 'px'
			});

			localAPIs.remove(el, 'padding-top, padding-bottom, margin-top, margin-bottom');

			$events.add('transitionend', el, () => {
				localAPIs.remove(el, 'height, overflow, transition-duration, transition-property');

				if (is.function(options.callback)) options.callback(el);
			}, {
				once: true
			});

		})
	};

	localAPIs.slideToggle = function (target, options = {}) {

		let defaults = {
			duration: slideAnimationDuration,
			onDown: null,
			onUp: null
		};

		options = Object.assign(defaults, options);

		if (localAPIs.get(target, 'display') === 'none') {
			localAPIs.slideDown(target, {
				duration: options.duration,
				callback: options.onDown
			})
		} else {
			localAPIs.slideUp(target, {
				duration: options.duration,
				callback: options.onUp
			})
		}
	};

	localAPIs.offset = function (element, relativeTo = 'document') {

		if (is.string(element)) element = get(element);

		switch (relativeTo) {
			case 'document':
				let
					rect = element.getBoundingClientRect(),
					scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
					scrollTop = window.pageYOffset || document.documentElement.scrollTop
				;

				return {
					left: rect.left + scrollLeft,
					top: rect.top + scrollTop
				};

			case 'parent':
				return {
					left: element.offsetLeft,
					top: element.offsetTop
				};
			default:
				return null;
		}
	};

	return localAPIs;

})(window);