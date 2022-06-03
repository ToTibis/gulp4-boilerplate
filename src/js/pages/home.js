import Page from '../classes/Page';
import {$events} from '../helpers/events';

const resizeCallback = event => {
  console.log('hello, i\'am resizeCallback, event is ', event)
};

const resizeRepeatCallback = event => {
  console.log('hello, i\'am resizeRepeatCallback, event is ', event)
};

const homePage = new Page({
  onCreate() {
    console.log('HomePage create')
  },
  onInit() {

    this
      .addResizeDependentMethod(resizeCallback)
      .addResizeDependentMethod(resizeRepeatCallback)
    ;



  },
  onDestroy() {
    console.log('HomePage destroy')
  },
  name: 'home',
  rootElementId: 'js-page-home'
});

export default homePage;
