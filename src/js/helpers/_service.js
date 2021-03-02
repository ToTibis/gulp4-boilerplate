import {$dom} from "./dom";
import {$data} from "./data";
import is from 'is_js';
import {$events} from "./events";
import {$style} from "./style";
import {$ui} from "./ui";
import ModalController from "../ui/Modal";
import variables from "../variables";

const APIName = variables.$EXTERNAL_API_NAME;
const functional = [
	{
		name: 'dom',
		value: $dom
	},
	{
		name: 'data',
		value: $data
	},
	{
		name: 'is',
		value: is
	},
	{
		name: 'events',
		value: $events
	},
	{
		name: 'style',
		value: $style
	},
	{
		name: 'ui',
		value: $ui
	},
	{
		name: 'ModalController',
		value: new ModalController({
			overlap: true
		})
	}
];

if (Boolean(window[APIName])) {
	console.warn('No global front API created! Specify a unique API name as an argument to the initGlobalApi function as a string')
} else {
	window[APIName] = {};

	functional.forEach(item => window[APIName][item.name] = item.value);
}
