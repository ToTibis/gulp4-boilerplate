import {$dom} from "./dom";
import {$events} from "./events";
import variables from "../variables";
import is from 'is_js';
import {$data} from "./data";
import {optimizeTarget, filterStringArgs, toDashesCase} from "./_utilities";

export const $style = (function () {

	const
		localAPIs = {},
		{callAll, get} = $dom,
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
				prop = toDashesCase(prop.trim());
				el.style.removeProperty(prop)
			})
		});

		return optimizeTarget(target)
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
