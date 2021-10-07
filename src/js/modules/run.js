import {$dom} from '../helpers/dom';
import regularPage from '../pages/regular';
import homePage from "../pages/home";
import variables from '../variables';
import '../components/bootstrap';

$dom.ready(function() {
  this.currentPage = [
    regularPage,
    homePage
  ].find(page => page.initialized);

  if (Boolean(this.currentPage)) {
    this.currentPage.variables = variables;
    this.currentPage.init();
  }
});
