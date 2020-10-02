import $assist from "../../utilities/Assistant";
import {domReady} from "../../utilities/callbacks";
import {callByGlobalResize} from "../../utilities/resizeTrigger";

domReady(() => {
	console.info('DOM is ready');

	console.info(
		'this is DOM-element with id "main" wrapped in Assistant-helper class',
		$assist('#main', $assist('body').el)
	); //or just pass 'body' as string as second parameter

	callByGlobalResize(() => {
		console.log('custom resize based on device done')
	})
});
