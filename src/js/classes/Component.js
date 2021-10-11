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
    this.initialized =
      exist(this.options.requiredSelector)
      ||
      is.undefined(this.options.requiredSelector)
      ||
      (is.function(this.options.requiredSelector) && this.options.requiredSelector() === true)
    ;
  }

  init() {
    if (!this.initialized) return;

    super.init();
  }
}
