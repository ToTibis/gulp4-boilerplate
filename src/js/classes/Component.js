import Model from './Model';
import {$data} from '../helpers/data';
import {$dom} from '../helpers/dom';
import is from 'is_js';

const {merge} = $data;
const {exist} = $dom;

export default class Component extends Model {
  constructor(options) {
    super(options);

    this.defaults = {
      requiredSelector: null
    };

    this.options = merge(this.defaults, options);
    this.created = exist(this.options.requiredSelector) || is.undefined(this.options.requiredSelector);

    this.payload = {
      init: Function.prototype,
      destroy: Function.prototype,
    };
  }


  init() {
    if (this.created) {
      super.init();
      return this.payload
    }

    return null
  }
}
