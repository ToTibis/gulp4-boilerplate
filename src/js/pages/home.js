import Page from '../classes/Page';

const homePage = new Page({
  onCreate() {
    console.log('homePage create')
  },
  onInit() {
    console.log('homePage init')
  },
  onDestroy() {
    console.log('homePage destroy')
  },
  name: 'home',
  rootElementId: 'js-page-home'
});

export default homePage;
