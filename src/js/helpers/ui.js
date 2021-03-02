import variables from "../variables";
import {warn} from "./_utilities";
import {$style} from "./style";

export const $ui = (function () {

	const
		APIs = {},
		{set, remove} = $style
	;

	APIs.blockScroll = function (action) {
		switch (action) {
			case 'enable':
				const sbw = variables.scrollbarWidth;
				set(document.body, {
					overflow: 'hidden',
					paddingRight: sbw + 'px'
				});
				break;
			case 'disable':
				remove(document.body, 'overflow, padding-right');
				break;
			default:
				warn('Missing argument in blockScroll function', '$ui-helper')
		}
	};


	return APIs;
})(window);
