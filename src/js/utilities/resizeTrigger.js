import {variables as $v} from "../variables";
import $assist from "./Assistant";
import {isMobileDevice} from "./checks";

const
	targetEvent = isMobileDevice() ? 'orientationchange' : 'resize',
	debounce = 100
;

let resizeTimout;

$assist(window).on(targetEvent, () => {
	clearTimeout(resizeTimout);
	resizeTimout = setTimeout(() => {
		$assist('body').el.dispatchEvent(new CustomEvent($v.customResizeEventName))
	}, debounce)
});

export function callByGlobalResize(cb) {
	$assist('body').on($v.customResizeEventName, () => {
		cb()
	})
}

