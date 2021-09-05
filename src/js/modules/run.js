import {$dom} from '../helpers/dom';
import regularPage from '../pages/regular';
import homePage from "../pages/home";
import variables from '../variables';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';
import Modal from 'bootstrap/js/dist/modal';
import {$events} from '../helpers/events';
import {$style} from '../helpers/style';

const {delegate} = $events;

const {get: domGet} = $dom;
const {get, set, remove, offset} = $style;


$dom.ready(() => {
  window.currentPage = [
    regularPage,
    homePage
  ].find(page => page.created);

  if (Boolean(window.currentPage)) {
    window.currentPage.variables = variables;
    window.currentPage.Bootstrap = {Modal, Offcanvas, Dropdown, Collapse};
    window.currentPage.init();
  }

  console.log(offset(domGet('ul')))
});
