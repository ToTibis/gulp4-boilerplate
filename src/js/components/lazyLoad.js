import LazyLoad from 'vanilla-lazyload';
import Component from '../classes/Component';
import variables from '../variables';
import {isElement} from '../helpers/_utilities';
import {$dom} from '../helpers/dom';

const {lazyLoaded, error} = variables.classNames;
const {get, attr} = $dom;

const
  wrapperSelector = '.js-lazy-image',
  elementSelector = '.js-lazy-image-element',
  loaderSelector = '.js-lazy-image-loader',
	errorAttr = 'data-error',
	dataSrcAttr = 'lazy-src',
	dataBgAttr = 'lazy-bg'
;

export default function(threshold = 0) {
  return new Component({
    name: 'lazyLoad',
    requiredTargets: elementSelector,
    onCreate() {
      this.lazyInstance = null
    },
    onInit() {
      this.lazyInstance = new LazyLoad({
        threshold,
        elements_selector: elementSelector,
        class_loaded: lazyLoaded,
        class_error: error,
        data_src: dataSrcAttr,
        data_bg: dataBgAttr,
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

