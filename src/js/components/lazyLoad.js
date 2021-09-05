import LazyLoad from 'vanilla-lazyload';
import Component from '../classes/Component';
import variables from '../variables';
import {isElement} from '../helpers/_utilities';
import {$dom} from '../helpers/dom';

const {
  lazyLoaded,
  error
} = variables.classNames;

const {
  get,
  attr
} = $dom;

export function lazyLoad(
  threshold = 0,
  errorAttr = 'data-error',
  wrapperSelector = '.js-lazy-image',
  elements_selector = '.js-lazy-image-element',
  loaderSelector = '.js-lazy-image-loader',
) {

  return new Component({
    name: 'lazyLoad',
    requiredSelector: elements_selector,
    onCreate() {
      this.lazyInstance = null
    },
    onInit() {
      this.lazyInstance = new LazyLoad({
        threshold,
        elements_selector: elements_selector,
        class_loaded: lazyLoaded,
        class_error: error,
        data_src: 'lazy-src',
        data_bg: 'lazy-bg',
        callback_loaded(el) {
          const wrapper = el.closest(wrapperSelector);
          el.removeAttribute(errorAttr);

          if (isElement(wrapper)) {
            const preloader = get(loaderSelector, wrapper);
            if (isElement(preloader)) preloader.remove()
          }
        },
        callback_error(el) {
          attr(el, errorAttr, variables.messages.lazyError);
          el.style.opacity = '1';
        }
      });
    },
    onDestroy() {
      if (this.lazyInstance instanceof LazyLoad) {
        this.lazyInstance.destroy();
        this.lazyInstance = null
      }
    }
  })
}