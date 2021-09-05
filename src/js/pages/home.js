import Page from '../classes/Page';

const sayHelloByResize = () => console.log('hello by resize!');

const homePage = new Page({
  onCreate() {
    // console.log('HomePage create')
  },
  onInit() {
    // console.log('HomePage init')
  },
  onDestroy() {
    // console.log('HomePage destroy')
  },
  name: 'home',
  rootElementId: 'js-page-home',
  // resizeMethods: [sayHelloByResize]
});

export default homePage;
