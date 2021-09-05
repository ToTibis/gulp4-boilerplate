import is from 'is_js';
import {$data} from '../helpers/data';
import {isElement} from '../helpers/_utilities';

const {merge} = $data;

export default class Model {
  constructor(options = {}) {
    this.defaults = {
      onCreate: null,
      onInit: null,
      onDestroy: null,
      name: null,
      rootElementId: null,
      debug: true
    };

    this.options = merge(this.defaults, options);
    this.name = options.name;
    this.rootElement = this.rootEl;

    this.checkAndRunCallback(this.options.onCreate);
  }

  get rootEl() {
    const
      {rootElementId} = this.options,
      el = document.getElementById(rootElementId)
    ;

    if (is.string(rootElementId) && Boolean(rootElementId) && isElement(el)) return el;

    return null
  }

  checkAndRunCallback(cb) {
    if (is.function(cb)) cb.call(this, this);
    return this;
  };

  init() {
    this.checkAndRunCallback(this.options.onInit);
  }
  destroy() {
    this.checkAndRunCallback(this.options.onDestroy);
  }
}
