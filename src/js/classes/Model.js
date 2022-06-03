import is from 'is_js';
import {$data} from '../helpers/data';
import {isElement} from '../helpers/_utilities';

const {merge} = $data;

export default class Model {
  #defaults = {
    onCreate: null,
    onInit: null,
    onDestroy: null,
    name: null,
    rootElementId: null
  };

  constructor(options = {}) {

    this.options = merge(this.#defaults, options);

    this.checkAndRunCallback(this.options.onCreate);
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

  refresh() {
    this.destroy();
    this.init();
  }
}
