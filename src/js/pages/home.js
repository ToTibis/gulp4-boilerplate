import Page from '../classes/Page';

const homePage = new Page({
  onCreate() {
    console.log('HomePage create')
  },
  onInit() {
    console.log('HomePage init')
  },
  onDestroy() {
    console.log('HomePage destroy')
  },
  name: 'home',
  rootElementId: 'js-page-home'
});

export default homePage;
