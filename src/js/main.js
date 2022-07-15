import 'svgxuse';

import {$dom} from './helpers/dom';
import regularPage from './pages/regular';
import homePage from "./pages/home";

import {isElement} from './helpers/_utilities';

const pages = [
	regularPage,
	homePage
];

$dom.ready(function() {
	this.currentPage = pages.find(page => isElement(page.rootEl));

	if (Boolean(this.currentPage)) this.currentPage.init()
});
