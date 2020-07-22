import {$assist} from 'Utilities/Assistant';
import {domReady} from "Utilities/callbacks";

domReady(() => {
	console.info('DOM is ready');
	console.info('this is DOM-element with id main wrapped in Assistant-helper class', $assist('#main'))
});
